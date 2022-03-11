import Head from 'next/head';
import Link from 'next/link';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { BlogPost, getBlogPosts } from '../util/database';

type Props =
  | {
      blogPosts: BlogPost[];
    }
  | {
      error: string;
    };

export default function BlogPostList(props: Props) {
  if ('error' in props) {
    return (
      <Layout>
        <Head>
          <title>Blog Post Error</title>
          <meta name="description" content="An error about an blog post " />
        </Head>
        <h1>Blog Posts Error</h1>
        {props.error}
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Posts</title>
        <meta name="description" content="These are my posts" />
      </Head>
      <div className={styles.createPostButtonContainer}>
        <Link href="/createPost" passHref>
          <Button
            animated="fade"
            className={styles.createPostButton}
            color="violet"
          >
            <Button.Content visible>WRITE . .</Button.Content>
            <Button.Content hidden>TELL YOUR STORY</Button.Content>
          </Button>
        </Link>
      </div>
      <div className={styles.cardContainer}>
        {/* <Grid centered> */}
        <Card.Group itemsPerRow={3}>
          {props.blogPosts.map((blogPost) => {
            return (
              <Card key={`blogPost-${blogPost.id}`} className={styles.card}>
                <Link href={`/blogPosts/${blogPost.id}`} passHref>
                  <Card.Content>
                    <Card.Header className={styles.cardHeader}>
                      {blogPost.title}
                    </Card.Header>
                    <Card.Description>{blogPost.story}</Card.Description>
                  </Card.Content>
                </Link>{' '}
              </Card>
            );
          })}
        </Card.Group>
        {/* </Grid> */}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  // this code is for restriction on pages (the user must be logged in to see or do something)
  // We have to call context in getServerSideProps function as well

  // const sessionToken = context.req.cookies.sessionToken;
  // const session = await getValidSessionByToken(sessionToken);

  // if (!session) {
  //   return {
  //     props: {
  //       error: 'In order to see blog posts, please log in',
  //     },
  //   };
  // }
  const blogPosts = await getBlogPosts();

  console.log('db', blogPosts);

  return {
    props: {
      blogPosts: blogPosts,
    },
  };
}
