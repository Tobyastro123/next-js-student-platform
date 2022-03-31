import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { BlogPost, getBlogPosts } from '../util/database';

type Props = {
  blogPosts: BlogPost[];
  userObject: { username: string };
};

export default function BlogPostList(props: Props) {
  const [search, setSearch] = useState('');
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Posts</title>
        <meta name="description" content="These are my posts" />
      </Head>
      <div className={styles.searchPostButtonContainer}>
        <input
          className={styles.searchPostButton}
          placeholder="Search..."
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
      </div>
      <div className={styles.cardContainer}>
        {/* <Grid centered> */}
        <Card.Group itemsPerRow={3}>
          {props.blogPosts
            .filter((blogPost) => {
              if (search === '') {
                return blogPost;
              } else if (
                blogPost.title.toLowerCase().includes(search.toLowerCase())
              ) {
                return blogPost;
              }
            })

            .map((blogPost) => {
              return (
                <Card
                  color="red"
                  key={`blogPost-${blogPost.id}`}
                  className={styles.card}
                >
                  <Image
                    src={blogPost.image}
                    className={styles.cardImage}
                    alt=""
                  />
                  <Link href={`/blogPosts/${blogPost.id}`} passHref>
                    <Card.Content>
                      <Card.Header className={styles.cardHeader}>
                        {blogPost.title}
                      </Card.Header>
                      {/* <Card.Description>{blogPost.story}</Card.Description> */}
                    </Card.Content>
                  </Link>{' '}
                  <Card.Content extra>
                    <Icon name="pencil alternate" />
                    {blogPost.author}
                  </Card.Content>
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
