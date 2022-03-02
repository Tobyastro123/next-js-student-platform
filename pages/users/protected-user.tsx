import { GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import { getUserById, getValidSessionByToken } from '../../util/database';

type Props = {
  userObject: { username: string };
  user: { id: number; username: string };
};
export default function ProtectedUser(props: Props) {
  return (
    <Layout userObject={props.userObject}>
      <h1>you only will see this if are logged in</h1>
      <div> user id is {props.user.id}</div>
      <div> user name is {props.user.username}</div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // 1. check if there is a token and is valid from the cookie
  const token = context.req.cookies.sessionToken;

  if (token) {
    // 2. check if the token its valid and redirect
    const session = await getValidSessionByToken(token);

    if (session) {
      const user = await getUserById(session.userId);

      console.log(user);

      return {
        props: { user: user },
      };
    }
  }

  // 3. otherwise render the page

  return {
    redirect: {
      destination: `/login?returnTo=/users/protected-user`,
      permanent: false,
    },
  };
}
