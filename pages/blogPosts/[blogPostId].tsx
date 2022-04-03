import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Button,
  Card,
  Comment,
  Container,
  Form,
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
  userObject: { username: string; image: string; userId: number };
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

  // console.log('Props in blogpostId', props);
  // console.log(
  //   'conditional',
  //   props.userObject &&
  //     props.userObject.username === props.blogPostComments[0].username,
  // );
  // const [title, setTitle] = useState('');
  // const [story, setStory] = useState('');

  // State Variable with the id of the animal on editMode
  const [idEditPostId, setIdEditPostId] = useState<number>();
  // State Variables for the on Edit inputs
  const [titleOnEdit, setTitleOnEdit] = useState('');
  const [storyOnEdit, setStoryOnEdit] = useState('');

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

  async function updatePost(id: number) {
    if (!titleOnEdit || !storyOnEdit) {
      console.log('I need more data to update');
      return;
    }
    const putResponse = await fetch(`/api/blogPosts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: {
          title: titleOnEdit,
          story: storyOnEdit,
        },
      }),
    });
    const putResponseBody = (await putResponse.json()) as PostResponseBody;

    if ('error' in putResponseBody) {
      setError(putResponseBody.error);
      return;
    }

    const newPostsList = posts.filter((post) => {
      return putResponseBody.post.id !== post.id;
    });

    setPosts(newPostsList);
    props.refreshUserProfile();
    await router.push(`/blogPosts/${id}`);
  }

  const [userComment, setUserComment] = useState<string>('');
  const [initialComments, setInitialComments] = useState(
    props.blogPostComments,
  );
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
    const newCommentList = initialComments.filter((comment) => {
      return newResponse.deletedComment.id !== comment.id;
    });
    setInitialComments(newCommentList);
  };
  const isDisabled = idEditPostId !== props.blogPosts.id;
  console.log('isDisabled', isDisabled);

  const isUser =
    props.userObject && props.userObject.username === props.blogPosts.username;
  console.log('isUser', isUser);
  // console.log('props.userObject.username', props.userObject.username);
  // console.log('props.blogPosts.username', props.blogPosts.username);

  return (
    <Layout userObject={props.userObject}>
      <div className={styles.singlePost}>
        <div>
          <Head>
            <title>Single Post Page</title>
            <meta name="description" content="This is my single Post PAge" />
          </Head>
          <div className={styles.singlePostBodyContainer}>
            <div className={styles.deleteButtonOnSinglePage}>
              <Card.Content extra className={styles.singlePostAuthor}>
                Written by {props.blogPosts.username}
              </Card.Content>
              {isUser ? (
                isDisabled ? (
                  <Icon
                    onClick={() => {
                      setIdEditPostId(props.blogPosts.id);
                      setTitleOnEdit(props.blogPosts.title);
                      setStoryOnEdit(props.blogPosts.story);
                    }}
                    name="edit"
                    color="green"
                  />
                ) : (
                  <Icon
                    onClick={() => {
                      updatePost(props.blogPosts.id).catch(() => {});
                      setIdEditPostId(undefined);
                    }}
                    name="save"
                    color="green"
                  />
                )
              ) : isDisabled ? (
                <Icon
                  className={styles.myProfileHiddenIcons}
                  onClick={() => {
                    setIdEditPostId(props.blogPosts.id);
                    setTitleOnEdit(props.blogPosts.title);
                    setStoryOnEdit(props.blogPosts.story);
                  }}
                  name="edit"
                  color="green"
                />
              ) : (
                <Icon
                  className={styles.myProfileHiddenIcons}
                  onClick={() => {
                    updatePost(props.blogPosts.id).catch(() => {});
                    setIdEditPostId(undefined);
                  }}
                  name="save"
                  color="green"
                />
              )}

              {isUser ? (
                <Icon
                  name="trash"
                  color="red"
                  onClick={() => {
                    deletePost(props.blogPosts.id).catch(() => {});
                  }}
                />
              ) : (
                <Icon
                  className={styles.myProfileHiddenIcons}
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
              <div>
                <div className={styles.singlePostTitle}>
                  <Header as="h2" dividing>
                    <textarea
                      className={styles.singlePostTitleInput}
                      onChange={(event) =>
                        setTitleOnEdit(event.currentTarget.value)
                      }
                      value={isDisabled ? props.blogPosts.title : titleOnEdit}
                      disabled={isDisabled}
                    />
                  </Header>
                </div>
                <div className={styles.singlePostStory}>
                  <textarea
                    className={styles.singlePostStoryInput}
                    onChange={(event) =>
                      setStoryOnEdit(event.currentTarget.value)
                    }
                    value={isDisabled ? props.blogPosts.story : storyOnEdit}
                    disabled={isDisabled}
                  />
                </div>
              </div>
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
                  const newCommentList = [...initialComments, newComment];
                  setInitialComments(newCommentList);

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
              {initialComments.length === 0 ? (
                <div> </div>
              ) : (
                initialComments.map((e) => {
                  return (
                    <Comment key={e.comment}>
                      <Comment.Avatar src={e.image} />
                      <Comment.Content>
                        <Comment.Author as="a">{e.username}</Comment.Author>{' '}
                        <Comment.Text>{e.comment} </Comment.Text>
                        <Comment.Actions>
                          <Comment.Action>
                            Reply {/*  i need a map here */}
                            {props.userObject &&
                              props.userObject.username === e.username && (
                                <Icon
                                  className={
                                    (styles.myProfileHidden,
                                    styles.editCommentIcon)
                                  }
                                  name="edit"
                                  color="green"
                                  onClick={() => deleteComment(e.id)}
                                />
                              )}
                            {props.userObject &&
                              props.userObject.username === e.username && (
                                <Icon
                                  className={
                                    (styles.myProfileHidden,
                                    styles.deleteCommentIcon)
                                  }
                                  name="trash"
                                  color="red"
                                  onClick={() => deleteComment(e.id)}
                                />
                              )}
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
): Promise<GetServerSidePropsResult<Record<string, unknown>>> {
  const blogPostId = context.query.blogPostId;
  const token = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(token);

  if (!user) {
    return {
      redirect: {
        destination: `/login?returnTo=/blogPosts/${blogPostId}`,
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
