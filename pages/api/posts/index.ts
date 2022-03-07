import { NextApiRequest, NextApiResponse } from 'next';
import { getBlogPosts } from '../../../util/database';

export default async function singleSeedHandler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // Retrieve all posts
  const allPosts = await getBlogPosts();

  // Return to the frontend
  return response.status(200).json({
    allPosts: allPosts,
  });
}
