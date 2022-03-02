import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

export default function About(props) {
  useEffect(() => {
    props.refreshUserProfile();
  }, [props]);

  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Home page</title>
        <meta name="description" content="Home page" />
      </Head>
      <div className={styles.aboutHomePage}>
        <div className={styles.aboutTextContainer}>
          <h1>Welcome</h1>
          <h2>to Mockingbird</h2>
          <p>
            Would like to learn how to play a new instrument, maybe would like
            to buy one for a gift or have one more in your collection?
            Mockingbird is the right place to be.{' '}
          </p>
          <Link href="/blogPostList" passHref>
            <button className={styles.shopButton}>Discover 🎵</button>
          </Link>
        </div>
        {/* <Image src="/musical_key.png" width="600" height="615" /> */}
      </div>
    </Layout>
  );
}
