import { NextApiRequest, NextApiResponse } from 'next';
import { BlogPost, createBlogPost, getBlogPosts } from '../../../util/database';

type PostsRequestBody = { blogPost: Omit<BlogPost, 'id'> };

type PostsNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: PostsRequestBody;
};

export type PostsResponseBodyGet = { blogPosts: BlogPost[] };

export type PostsResponseBodyPost = { error: string } | { blogPost: BlogPost };

type PostsResponseBody = PostsResponseBodyGet | PostsResponseBodyPost;

export default async function createBlogPostHandler(
  request: PostsNextApiRequest,
  response: NextApiResponse<PostsResponseBody>,
) {
  if (request.method === 'GET') {
    const blogPosts = await getBlogPosts();
    response.status(200).json({ blogPosts: blogPosts });
    return;
  } else if (request.method === 'POST') {
    const postFromRequest = request.body.blogPost;

    const newPost = await createBlogPost(
      postFromRequest.username,
      postFromRequest.title,
      postFromRequest.story,
      postFromRequest.topic,
    );

    response.status(201).json({ blogPost: newPost });
    return;
  }

  response.status(405).json({ error: 'Method not Allowed' });
}
