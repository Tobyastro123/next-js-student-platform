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

// Type needed for the connection function below
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}
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

export type BlogPost = {
  id: number;
  title: string;
  story: string;
};

export async function getBlogPosts() {
  const blogPosts = await sql<BlogPost[]>`
    SELECT * FROM blogPosts;
  `;
  return blogPosts.map((blogPost) => camelcaseKeys(blogPost));
}

export async function getBlogPostsById(id: number) {
  const [blogPost] = await sql<BlogPost[]>`
    SELECT * FROM blogPosts WHERE id = ${id};
  `;
  return camelcaseKeys(blogPost);
}

// User
export type User = {
  id: number;
  username: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export async function getUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      id = ${id}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserByValidSessionToken(token: string | undefined) {
  if (!token) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
      users.id,
      users.username
    FROM
      users,
      sessions
    WHERE
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      sessions.expiry_timestamp > now()
  `;
  return user && camelcaseKeys(user);
}

export async function getUserByUsername(username: string) {
  const [user] = await sql<[{ id: number } | undefined]>`
    SELECT id FROM users WHERE username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT
      id,
      username,
      password_hash
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user && camelcaseKeys(user);
}

export async function createUser(username: string, passwordHash: string) {
  const [user] = await sql<[User]>`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${username}, ${passwordHash})
    RETURNING
      id,
      username
  `;
  return camelcaseKeys(user);
}

// session

type Session = {
  id: number;
  token: string;
  userId: number;
};

export async function createSession(token: string, userId: number) {
  const [session] = await sql<[Session]>`
  INSERT INTO sessions
    (token, user_id)
  VALUES
    (${token}, ${userId})
  RETURNING
   id,
   token
`;

  await deleteExpiredSessions();

  return camelcaseKeys(session);
}

export async function deleteSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  DELETE FROM
  sessions
  WHERE
    token = ${token}
  RETURNING *
`;
  return session && camelcaseKeys(session);
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < NOW()
    RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}

export async function getValidSessionByToken(token: string) {
  const [session] = await sql<[Session | undefined]>`
  SELECT
   *
  FROM
    sessions
  WHERE
  token = ${token}
`;

  await deleteExpiredSessions();

  return session && camelcaseKeys(session);
}
