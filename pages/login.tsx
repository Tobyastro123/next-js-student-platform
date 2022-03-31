import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { createCsrfToken } from '../util/auth';
import { getValidSessionByToken } from '../util/database';
import { LoginResponseBody } from './api/login';

type Errors = { message: string }[];

type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
  csrfToken: string;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login on this website" />
      </Head>

      <div className={styles.loginContainer}>
        <Form
          onSubmit={async (event) => {
            event.preventDefault();

            const loginResponse = await fetch('/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: password,
                csrfToken: props.csrfToken,
              }),
            });

            const loginResponseBody =
              (await loginResponse.json()) as LoginResponseBody;

            if ('errors' in loginResponseBody) {
              setErrors(loginResponseBody.errors);
              return;
            }

            // Get the query parameter from the Next.js router
            const returnTo = router.query.returnTo;
            console.log('returnTo', returnTo);

            if (
              returnTo &&
              !Array.isArray(returnTo) &&
              // Security: Validate returnTo parameter against valid path
              // (because this is untrusted user input)
              /^\/[a-zA-Z0-9-?=]*$/.test(returnTo)
            ) {
              await router.push(returnTo);
              return;
            }

            // Login worked, redirect to the homepage using the Next.js router
            // setErrors([]); // clear the errors - maybe not necessary with redirect
            props.refreshUserProfile();
            await router.push(`/`);
          }}
        >
          <h1 className={styles.loginInputTitle}>Login</h1>
          <Form.Field>
            <label>
              <input
                value={username}
                placeholder="Enter your username"
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </label>
          </Form.Field>

          <Form.Field>
            <label>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </label>
          </Form.Field>

          <Button basic color="green">
            Login
          </Button>
        </Form>
      </div>

      <div className={styles.errorStyles}>
        {errors.map((error) => {
          return <div key={`error-${error.message}`}>{error.message}</div>;
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }
  // 1. check if there is a token and is valid from the cookie
  const token = context.req.cookies.sessionToken;

  if (token) {
    // 2. check if the token its valid and redirect
    const session = await getValidSessionByToken(token);

    if (session) {
      console.log(session);
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  // 3. Otherwise, generate CSRF token and render the page
  return {
    props: {
      csrfToken: createCsrfToken(),
    },
  };
}
