import Head from 'next/head';
import { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

export default function CreateBlogPost() {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');

  return (
    <Layout>
      <Head>
        <title>Create a Blog Post</title>
        <meta name="description" content="Create a blog post" />
      </Head>

      <h1>Create a blog post</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          fetch('/api/createPost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: title,
              story: story,
            }),
          });
        }}
      >
        <div>
          <div className={styles.inputFieldsUserLoginUsername}>
            <label>
              {/* Username:{' '} */}
              <input
                value={title}
                placeholder="Enter title"
                onChange={(event) => setTitle(event.currentTarget.value)}
              />
            </label>
          </div>

          <div className={styles.inputFieldsUserLoginPassword}>
            <label>
              {/* Password:{' '} */}
              <input
                value={story}
                placeholder="Write your story"
                onChange={(event) => setStory(event.currentTarget.value)}
              />
            </label>
          </div>
        </div>
        <div className={styles.loginButton}>
          <button>Create a Post</button>
        </div>
      </form>
    </Layout>
  );
}
