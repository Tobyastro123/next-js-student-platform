import { NextApiRequest, NextApiResponse } from 'next';
import { createBlogPost } from '../../util/database';

export default async function createBlogPostHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const post = await createBlogPost(request.body.title, request.body.story);

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
