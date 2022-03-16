import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyCsrfToken } from '../../util/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  createUser,
  getUserByUsername,
  User,
} from '../../util/database';

export type RegisterRequestBody = {
  username: string;
  password: string;
  image: string;
  csrfToken: string;
};

export type RegisterNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: RegisterRequestBody;
};

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: User };

export default async function registerHandler(
  request: RegisterNextApiRequest,
  response: NextApiResponse<RegisterResponseBody>,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.username !== 'string' ||
      !request.body.username ||
      typeof request.body.password !== 'string' ||
      !request.body.password ||
      typeof request.body.image !== 'string' ||
      !request.body.image ||
      typeof request.body.csrfToken !== 'string' ||
      !request.body.csrfToken
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Username, password or CSRF token not provided',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }

    // Verify CSRF Token
    const csrfTokenMatches = verifyCsrfToken(request.body.csrfToken);

    if (!csrfTokenMatches) {
      response.status(403).json({
        errors: [
          {
            message: 'Invalid CSRF token',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }

    // If there is already a user matching the username,
    // return error message
    if (await getUserByUsername(request.body.username)) {
      response.status(409).json({
        errors: [
          {
            message: 'Username already taken',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }
    // const image = request.body.image;
    const passwordHash = await bcrypt.hash(request.body.password, 12);
    const user: User = await createUser(
      request.body.username,
      // i think i have to pass the image here for each user from database
      request.body.image,
      passwordHash,
    );

    // 1. Create a unique token
    const token = crypto.randomBytes(64).toString('base64');

    // 2. Create the session
    const session = await createSession(token, user.id);

    console.log(session);

    // 3. Serialize the cookie
    const serializedCookie = await createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    // 4. Add the cookie to the header response
    response
      .status(201)
      .setHeader('Set-Cookie', serializedCookie)
      .json({ user: user });
    return;
  }

  response.status(405).json({
    errors: [
      {
        message: 'Method not supported, try POST instead',
      },
    ],
  });
}
