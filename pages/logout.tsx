import { serialize } from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';
import { deleteSessionByToken } from '../util/database';

type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
};
export default function Logout(props: Props) {
  useEffect(() => {
    props.refreshUserProfile();
  }, [props]);
  return 'Logged out';
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // 1. get the cookie from the context and get the session token
  const token = context.req.cookies.sessionToken;

  if (token) {
    console.log(token);
    // 2. we want to delete the session from our database
    await deleteSessionByToken(token);
    // 3. we want to set the cookie destruction

    context.res.setHeader(
      'Set-Cookie',
      serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    );
  }
  // 4. we need to redirect to the page that linked logout

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
