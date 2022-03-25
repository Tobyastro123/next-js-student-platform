import camelcaseKeys from 'camelcase-keys';
import { config } from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku.js';

setPostgresDefaultsOnHeroku();

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
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    sql = postgres();

    // Heroku needs SSL connections but

    // has an "unauthorized" certificate

    // https://devcenter.heroku.com/changelog-items/852

    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }
  return sql;
}

// Connect to PostgreSQL
const sql = connectOneTimeToDatabase();

// blogPosts

export type BlogPost = {
  id: number;
  title: string;
  story: string;
  author: string;
  image: string;
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

export async function createBlogPost(
  title: string,
  story: string,
  author: string,
  image: string,
) {
  const [post] = await sql<[BlogPost]>`
    INSERT INTO blogPosts
      (title, story, author, image)
    VALUES
      (${title}, ${story}, ${author}, ${image})
    RETURNING
      id,
      title
  `;
  return camelcaseKeys(post);
}

export async function updateBlogPostById(
  id: number,
  title: string,
  story: string,
) {
  const [post] = await sql<[BlogPost | undefined]>`
    UPDATE
      blogPosts
    SET
      title = ${title},
      story = ${story}
    WHERE
      id = ${id}
    RETURNING *
  `;
  return post && camelcaseKeys(post);
}

export async function deleteBlogPostById(id: number) {
  const [post] = await sql<[BlogPost | undefined]>`
    DELETE FROM
      blogPosts
    WHERE
      id = ${id}
    RETURNING *
  `;
  return post && camelcaseKeys(post);
}

export async function getPostsFromUserId(userId: number) {
  if (!userId) return undefined;

  const posts = await sql<[BlogPost]>`
    SELECT
      *
    FROM
      blogPosts
    WHERE
      user_id = ${userId};
  `;

  return posts.map((post) => {
    return camelcaseKeys(post);
  });
}

// User
export type User = {
  id: number;
  username: string;
  image: string;
};

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export async function getUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username,
      image
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
      users.username,
      users.image
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

export async function createUser(
  username: string,
  image: string,
  passwordHash: string,
) {
  const [user] = await sql<[User]>`
    INSERT INTO users
      (username, image, password_hash)
    VALUES
      (${username}, ${image}, ${passwordHash})
    RETURNING
      id,
      username,
      image
  `;
  return camelcaseKeys(user);
}

// session
type Session = {
  id: number;
  token: string;
  userId: number;
};

export async function getValidSessionByToken(token: string | undefined) {
  if (!token) return undefined;
  const [session] = await sql<[Session | undefined]>`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${token} AND
      expiry_timestamp > now()
  `;

  await deleteExpiredSessions();

  return session && camelcaseKeys(session);
}

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
