import Head from 'next/head';
import Layout from '../components/Layout';
import TextContainer from '../components/TextContainer';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to homepage" />
      </Head>
      <div>
        <TextContainer />
      </div>
    </Layout>
  );
}
