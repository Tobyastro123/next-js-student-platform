import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Image } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { getUserByValidSessionToken } from '../../util/database';

type Props = {
  userObject: { username: string };
  user: { id: number; username: string; image: string };
};
export default function ProtectedUser(props: Props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User profile" />
      </Head>
      <div className={styles.profilePage}>
        <div>
          <div>
            <h1>Welcome</h1>
          </div>
          <Image src={props.user.image} alt="" />
          <div className={styles.userName}> {props.user.username}</div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // 1. Get a user from the cookie sessionToken
  const token = context.req.cookies.sessionToken;
  const user = await getUserByValidSessionToken(token);

  // 2. If there is a user, return that and render page
  if (user) {
    return {
      props: { user: user },
    };
  }

  // 3. Otherwise redirect to login
  return {
    redirect: {
      destination: `/login?returnTo=/users/protected-user`,
      permanent: false,
    },
  };
}
