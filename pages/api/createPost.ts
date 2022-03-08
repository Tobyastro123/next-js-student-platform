// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { BlogPost, createBlogPost, getBlogPosts } from '../../util/database';

type PostsRequestBody = { post: Omit<BlogPost, 'id'> };

type PostsNextApiRequest = Omit<NextApiRequest, 'body'> & {
  body: PostsRequestBody;
};

export type PostsResponseBodyGet = {
  posts: BlogPost[];
};

export type PostsResponseBodyPost = { error: string } | { post: BlogPost };

type PostsResponseBody = PostsResponseBodyGet | PostsResponseBodyPost;

export default async function handler(
  request: PostsNextApiRequest,
  response: NextApiResponse<PostsResponseBody>,
) {
  console.log('request Method', request.method);
  console.log('request Body', request.body);

  // access the method from the request object
  if (request.method === 'GET') {
    // if the method is get response with an array of animals

    const posts = await getBlogPosts();

    response.status(200).json({ posts: posts });
    return;
  } else if (request.method === 'POST') {
    // if the post create a new animal and response the new created animal

    // access the body animal from the request object
    const postFromRequest = request.body.post;

    // TODO: create error responses when the body don't have the full data. with a 400 status code

    const newPost = await createBlogPost(
      postFromRequest.title,
      postFromRequest.story,
    );

    response.status(200).json({ post: newPost });
    return;
  }

  response.status(405).json({ error: 'Method not Allowed' });

  // if any other method response method not allowed
}
