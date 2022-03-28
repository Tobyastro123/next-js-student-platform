import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Button,
  Card,
  Comment,
  Container,
  Divider,
  Form,
  HeaderContent,
  Header,
  Icon,
  Image,
} from 'semantic-ui-react';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import {
  BlogPost,
  getBlogPostsById,
  getCommentByPostId,
  getUserByValidSessionToken,
} from '../../util/database';
import { PostResponseBody } from '../api/blogPosts/[singlePostId]';

type Props = {
  blogPosts: BlogPost;
  refreshUserProfile: () => void;
  userObject: { username: string; image: string };
  blogPostComments: {
    comment: string;
    id: number;
    username: string;
    post_id: number;
    image: string;
    user_id: number;
  }[];
  userId: number;
  image: string;
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
    await router.push('/posts');
  }

  const [userComment, setUserComment] = useState<string>('');
  const [initialComment, setInitialComment] = useState(props.blogPostComments);
  console.log('props', props);
  const deleteComment = async (id: number) => {
    const response = await fetch(`/api/comment`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId: id,
      }),
    });
    const newResponse = await response.json();
    console.log('newResponse', newResponse.deletedComment);
    const newCommentList = initialComment.filter((comment) => {
      return newResponse.deletedComment.id !== comment.id;
    });
    setInitialComment(newCommentList);
  };

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
              <Card.Content extra className={styles.singlePostAuthor}>
                <Icon name="pencil alternate" />
                {props.blogPosts.author}
              </Card.Content>
              {!props.userObject && (
                <li className={styles.myProfileHidden}>
                  <Icon
                    name="trash"
                    color="red"
                    onClick={() => {
                      deletePost(props.blogPosts.id).catch(() => {});
                    }}
                  />
                </li>
              )}
              {props.userObject && (
                <Icon
                  name="trash"
                  color="red"
                  onClick={() => {
                    deletePost(props.blogPosts.id).catch(() => {});
                  }}
                />
              )}
            </div>
            <Container className={styles.singlePostContainer}>
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
            <Comment.Group>
              <Header as="h3" dividing>
                Comments
              </Header>
              <Form
                className={styles.commentForm}
                onSubmit={async (event) => {
                  event.preventDefault();
                  const commentResponse = await fetch('/api/comment', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userComment: userComment,
                      blogPostId: props.blogPosts.id,
                      userId: props.userId,
                      username: props.userObject.username,
                      image: props.userObject.image,
                    }),
                  });
                  const newComment = await commentResponse.json();
                  // console.log('commentResponse.body', newComment);
                  setUserComment('');
                  const newCommentList = [...initialComment, newComment];
                  setInitialComment(newCommentList);

                  return;
                }}
              >
                <Form.TextArea
                  value={userComment}
                  onChange={(event) =>
                    setUserComment(event.currentTarget.value)
                  }
                />

                <Button>Comment</Button>
              </Form>
              {initialComment.length === 0 ? (
                <div> </div>
              ) : (
                initialComment.map((e) => {
                  return (
                    <Comment key={e.comment}>
                      <Comment.Avatar src={e.image} />
                      <Comment.Content>
                        <Comment.Author as="a">{e.username}</Comment.Author>{' '}
                        <Comment.Text>{e.comment} </Comment.Text>
                        <Comment.Actions>
                          <Comment.Action>
                            Reply{' '}
                            <Icon
                              className={styles.editCommentIcon}
                              name="edit"
                              color="green"
                              onClick={() => deleteComment(e.id)}
                            />
                            <Icon
                              className={styles.deleteCommentIcon}
                              name="trash"
                              color="red"
                              onClick={() => deleteComment(e.id)}
                            />
                          </Comment.Action>
                        </Comment.Actions>
                      </Comment.Content>
                    </Comment>
                  );
                })
              )}
            </Comment.Group>
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
): Promise<GetServerSidePropsResult<{}>> {
  const blogPostId = context.query.blogPostId;
  const token = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(token);

  if (!user) {
    return {
      redirect: {
        destination: `/login?returnTo=/recipes/${blogPostId}`,
        permanent: false,
      },
    };
  }
  // Blog Post id is not correct type
  if (!blogPostId || Array.isArray(blogPostId)) {
    return { props: {} };
  }
  const blogPostComments = await getCommentByPostId(parseInt(blogPostId));

  console.log('blogPostComment in terminal', blogPostComments);

  const postCommentMap = blogPostComments.map((blogPosts) => blogPosts.comment);

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

      blogPosts: blogPosts,
      blogPostComments: blogPostComments,
      userId: user?.id,
    },
  };
}
