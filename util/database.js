// Don't copy this readFileSync - you don't need it
// eslint-disable-next-line unicorn/prefer-node-protocol
// import { readFileSync } from 'fs';
import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';

// Read the environment variables from the .env
// file, which will then be available for all
// following code
config();

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  if (!globalThis.postgresSqlClient) {
    globalThis.postgresSqlClient = postgres();
  }
  const sql = globalThis.postgresSqlClient;

  return sql;
}
// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

export async function getBlogPosts() {
  const blogPosts = await sql`
    SELECT * FROM blogPosts;
  `;
  return blogPosts.map((blogPost) => camelcaseKeys(blogPost));
}

export async function getBlogPostsById(id) {
  const [blogPost] = await sql`
    SELECT * FROM blogPosts WHERE id = ${id};
  `;
  return camelcaseKeys(blogPost);
}
