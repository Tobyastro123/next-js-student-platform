import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { RegisterResponseBody } from './api/register';

type Errors = { message: string }[];

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register on this website" />
      </Head>
      <div className={styles.loginContainer}>
        <div>
          <div className={styles.loginTitle}>
            <h1>Register</h1>
          </div>
          <div>
            <form
              onSubmit={async (event) => {
                event.preventDefault();

                const registerResponse = await fetch('/api/register', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    username: username,
                    password: password,
                  }),
                });

                const registerResponseBody =
                  (await registerResponse.json()) as RegisterResponseBody;

                if ('errors' in registerResponseBody) {
                  setErrors(registerResponseBody.errors);
                  return;
                }

                await router.push('/');
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
                <button>Register</button>
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
