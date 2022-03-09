import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
};

export default function CreateBlogPost(props: Props) {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const router = useRouter();

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Create a Blog Post</title>
        <meta name="description" content="Create a blog post" />
      </Head>
      <div className={styles.createPostContainer}>
        {/* <h1>Create a blog post</h1> */}
        <Form
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch('/api/createPost', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: title,
                story: story,
              }),
            });
            props.refreshUserProfile();
            await router.push('/');
          }}
        >
          <Form.Field>
            <label>
              <input
                value={title}
                placeholder="Enter title"
                onChange={(event) => setTitle(event.currentTarget.value)}
              />
            </label>
          </Form.Field>

          <Form.TextArea
            style={{ minHeight: 200 }}
            value={story}
            placeholder="Write your story"
            onChange={(event) => setStory(event.currentTarget.value)}
          />

          <Button>Create a Post</Button>
        </Form>
      </div>
    </Layout>
  );
}
