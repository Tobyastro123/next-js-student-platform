import { NextApiRequest, NextApiResponse } from 'next';
import {
  BlogPost,
  deleteBlogPostById,
  getBlogPostsById,
  updateBlogPostById,
} from '../../../util/database';

type PostRequestBody = {
  post: BlogPost;
};

type PostNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: PostRequestBody;
};

export type PostResponseBody = { error: string } | { post: BlogPost };

export default async function singlePostHandler(
  request: PostNextApiRequest,
  response: NextApiResponse<PostResponseBody>,
) {
  console.log('is this the id', request.query.singlePostId);

  const singlePostId = Number(request.query.singlePostId);
  // check that the id passed is a number

  console.log(singlePostId);
  // check if singlePostId is not a number
  if (!singlePostId) {
    response.status(400).json({ error: 'singlePostId must be a number' });
    return;
  }

  if (request.method === 'GET') {
    const post = await getBlogPostsById(singlePostId);

    // check if there is not post with the id passed into the database
    console.log(post);
    if (!post) {
      response.status(404).json({ error: 'post not found' });
      return;
    }

    // if the method is GET return the post with the matched id
    response.status(200).json({ post: post });
    return;
  } else if (request.method === 'PUT') {
    // if the method is PUT update the post and response the updated post

    // access the body post from the request object
    const postFromRequest = request.body.post;

    // TODO: create error responses when the body don't have the full data. with a 400 status code

    const updatedPost = await updateBlogPostById(
      singlePostId,
      postFromRequest.title,
      postFromRequest.story,
    );

    if (!updatedPost) {
      response.status(404).json({ error: 'post not found' });
      return;
    }

    response.status(200).json({ post: updatedPost });
    return;
  } else if (request.method === 'DELETE') {
    // if the method is DELETE delete the post matching the id and response the deleted post
    const deletedPost = await deleteBlogPostById(singlePostId);

    if (!deletedPost) {
      response.status(404).json({ error: 'post not found' });
      return;
    }

    response.status(200).json({ post: deletedPost });
    return;
  }

  response.status(405).json({ error: 'Method not Allowed' });
}
