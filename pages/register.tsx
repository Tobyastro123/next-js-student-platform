import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { createCsrfToken } from '../util/auth';
import { getValidSessionByToken } from '../util/database';
import { RegisterResponseBody } from './api/register';

type Errors = { message: string }[];

type Props = {
  refreshUserProfile: () => void;
  userObject: { username: string };
  csrfToken: string;

  cloudinaryAPI: string;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  const uploadImage = async (event: any) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'my-uploads');
    setLoading(true);
    const response = await fetch(
      `	https://api.cloudinary.com/v1_1/${props.cloudinaryAPI}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await response.json();

    setImage(file.secure_url);
    setLoading(false);
  };

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register on this website" />
      </Head>

      <div className={styles.loginContainer}>
        <Form
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
                csrfToken: props.csrfToken,
                image: image,
              }),
            });

            const registerResponseBody =
              (await registerResponse.json()) as RegisterResponseBody;

            if ('errors' in registerResponseBody) {
              setErrors(registerResponseBody.errors);
              return;
            }

            props.refreshUserProfile();

            await router.push('/');
          }}
        >
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
          <div>
            <label htmlFor="picture">Image</label>
            <input
              id="file"
              type="file"
              required
              placeholder="Upload an image"
              onChange={uploadImage}
            />
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <img src={image} className="mt-4" alt="upload" />
              )}
            </div>
          </div>
          <Button>Register</Button>
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
        destination: `https://${context.req.headers.host}/register`,
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

  const cloudinaryAPI = process.env.CLOUDINARY_KEY;

  // 3. otherwise render the page
  return {
    props: {
      cloudinaryAPI,
      csrfToken: createCsrfToken(),
    },
  };
}
