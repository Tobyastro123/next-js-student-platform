import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Button,
  Card,
  Container,
  Divider,
  HeaderContent,
  Icon,
  Image,
} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { BlogPost, getBlogPostsById } from '../../util/database';
import { PostResponseBody } from '../api/blogPosts/[singlePostId]';

type Props = {
  blogPosts: BlogPost;
  refreshUserProfile: () => void;
  userObject: { username: string };
};

export default function SingleBlogPost(props: Props) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  // const [title, setTitle] = useState('');
  // const [story, setStory] = useState('');

  // State Variable with the id of the animal on editMode
  // const [idEditPostId, setIdEditPostId] = useState<number>();
  // State Variables for the on Edit inputs
  // const [titleOnEdit, setTitleOnEdit] = useState('');
  // const [storyOnEdit, setStoryOnEdit] = useState('');

  const [error, setError] = useState('');

  const router = useRouter();

  async function deletePost(id: number) {
    const deleteResponse = await fetch(`/api/blogPosts/${id}`, {
      method: 'DELETE',
    });
    const deleteResponseBody =
      (await deleteResponse.json()) as PostResponseBody;

    if ('error' in deleteResponseBody) {
      setError(deleteResponseBody.error);
      return;
    }

    const newPostsList = posts.filter((post) => {
      return deleteResponseBody.post.id !== post.id;
    });

    setPosts(newPostsList);
    props.refreshUserProfile();
    await router.push('/');
  }

  return (
    <Layout userObject={props.userObject}>
      <div className={styles.singlePost}>
        <div>
          <Head>
            <title>Single Post Page</title>
            <meta name="description" content="This is my single Post PAge" />
          </Head>
          <div>
            <div className={styles.deleteButtonOnSinglePage}>
              <Button
                inverted
                color="red"
                onClick={() => {
                  deletePost(props.blogPosts.id).catch(() => {});
                }}
              >
                Delete
              </Button>
            </div>
            <Container className={styles.singlePostContainer}>
              <Card.Content extra>
                <Icon name="pencil alternate" />
                {props.blogPosts.author}
              </Card.Content>
              <Image
                src={props.blogPosts.image}
                alt=""
                className={styles.singlePostImage}
              />
              <HeaderContent as="h2"> {props.blogPosts.title}</HeaderContent>
              <Divider className={styles.dividerSinglePostPage} />
              <p className={styles.paragraphSinglePostPage}>
                {' '}
                {props.blogPosts.story}{' '}
              </p>
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Code in getServerSideProps runs only in
// Node.js, and allows you to do fancy things:
// - Read files from the file system
// - Connect to a (real) database
//
// getServerSideProps is exported from your files
// (ONLY FILES IN /pages) and gets imported
// by Next.js
export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<{ blogPosts?: BlogPost }>> {
  const blogPostId = context.query.blogPostId;

  // Blog Post id is not correct type
  if (!blogPostId || Array.isArray(blogPostId)) {
    return { props: {} };
  }

  const blogPosts = await getBlogPostsById(parseInt(blogPostId));

  console.log('db', blogPosts);

  // Important:
  // - Always return an object from getServerSideProps
  // - Always return a key in that object that is
  // called props

  // 1. get the cookies from the browser
  // 2. pass the cookies to the frontend
  return {
    props: {
      // In the props object, you can pass back
      // whatever information you want

      blogPosts,
    },
  };
}
