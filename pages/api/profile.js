import { getUserById, getValidSessionByToken } from '../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.cookies.sessionToken;

    if (token) {
      const session = await getValidSessionByToken(token);

      const user = await getUserById(session.userId);

      res.status(200).json({
        user: user,
      });
      return;
    }

    res.status(404).json({
      errors: [
        {
          message: 'Session Token No Found',
        },
      ],
    });
    return;
  }

  res.status(405).json({
    errors: [
      {
        message: 'Method not supported, try GET instead',
      },
    ],
  });
}
