import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { getValidSessionByToken } from '../util/database';
import { LoginResponseBody } from './api/login';

type Errors = { message: string }[];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login on this website" />
      </Head>

      <div className={styles.loginContainer}>
        <div>
          <div className={styles.loginTitle}>
            <h1>Login</h1>
          </div>

          <div>
            <form
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
                await router.push(`/users/${loginResponseBody.user.id}`);
              }}
            >
              <div>
                <div className={styles.inputFieldsUserLoginUsername}>
                  <label>
                    {/* Username:{' '} */}
                    <input
                      value={username}
                      placeholder="Enter your username"
                      onChange={(event) =>
                        setUsername(event.currentTarget.value)
                      }
                    />
                  </label>
                </div>

                <div className={styles.inputFieldsUserLoginPassword}>
                  <label>
                    {/* Password:{' '} */}
                    <input
                      type="password"
                      value={password}
                      placeholder="Enter your password"
                      onChange={(event) =>
                        setPassword(event.currentTarget.value)
                      }
                    />
                  </label>
                </div>
              </div>

              <div className={styles.loginButton}>
                <button>Login</button>
              </div>
            </form>
          </div>
        </div>
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

  // 3. otherwise render the page

  return {
    props: {},
  };
}
