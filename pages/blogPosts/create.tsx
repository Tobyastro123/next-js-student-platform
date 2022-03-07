import { css } from '@emotion/react';
import { Editor } from '@tinymce/tinymce-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { Button, Card, Confirm, Form, Grid, Icon } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { BlogPost } from '../../util/database';

export type Props = {
  id?: number;
};

type ChangeInputHandler = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

// const initialState = {
//   title: '',
//   story: '',
// };

const NewPage = (): JSX.Element => {
  const [post, setPost] = useState<BlogPost>();
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const router = useRouter();

  const createPost = async () =>
    await fetch('/api/posts/create', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json',
      },
    });

  const updatePost = async () =>
    await fetch('/api/posts/create', {
      method: 'PUT',
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json',
      },
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (typeof router.query.id === 'number') {
        await updatePost();
      } else {
        await createPost();
      }
      await setPost(post);
      await router.push('/');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // const handleChange = ({ target: { name, value } }: ChangeInputHandler) =>
  //   setPost({ ...post, [name]: value });

  // const loadPost = async (id: number) => {
  //   const res = await fetch('/api/posts/create' + id);
  //   const post = await res.json();
  //   setPost({ title: post.title, story: post.story });
  // };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch('/api/posts/create' + id, {
        method: 'DELETE',
      });
      await router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Grid
        centered
        columns={3}
        verticalAlign="middle"
        style={{ height: '70%' }}
      >
        <Grid.Column>
          <Card>
            <Card.Content>
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    placeholder="Write a title"
                    name="title"
                    // onChange={handleChange}
                    // value={post.title}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="description">Description:</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={2}
                    placeholder="Write a Description"
                    // onChange={handleChange}
                    // value={post.story}
                  />
                </Form.Field>
                {router.query.id ? (
                  <Button color="teal" loading={loading}>
                    <Icon name="save" />
                    Update
                  </Button>
                ) : (
                  <Button primary loading={loading}>
                    <Icon name="save" />
                    Save
                  </Button>
                )}
              </Form>
            </Card.Content>
          </Card>

          {router.query.id && (
            <Button inverted color="red" onClick={() => setOpenConfirm(true)}>
              <Icon name="trash" />
              Delete
            </Button>
          )}
        </Grid.Column>
      </Grid>

      <Confirm
        header="Delete a Task"
        content={`Are you sure you want to delete task ${router.query.id}`}
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() =>
          typeof router.query.id === 'number' && handleDelete(router.query.id)
        }
      />
    </Layout>
  );
};

export default NewPage;
