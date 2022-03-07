import { NextApiRequest, NextApiResponse } from 'next';
import { BlogPost, createPost } from '../../../util/database';

type RegisterRequestBody = {
  title: string;
  story: string;
};

type RegisterNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: RegisterRequestBody;
};

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { post: BlogPost };

export default async function createPostHandler(
  request: RegisterNextApiRequest,
  response: NextApiResponse<RegisterResponseBody>,
) {
  if (request.method === 'POST') {
    if (
      typeof request.body.title !== 'string' ||
      !request.body.title ||
      typeof request.body.story !== 'string' ||
      !request.body.story
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Title, story not fill up',
          },
        ],
      });
      return; // Important: will prevent "Headers already sent" error
    }

    //  // If there is already a user matching the username,
    // // return error message
    // if (await getUserByUsername(request.body.username)) {
    //   response.status(409).json({
    //     errors: [
    //       {
    //         message: 'Username already taken',
    //       },
    //     ],
    //   });
    //   return; // Important: will prevent "Headers already sent" error
    // }

    // Save the seed information to the database
    const post = await createPost(request.body.title, request.body.story);

    // 4. Add the cookie to the header response
    response.status(201).json({ post: post });
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
