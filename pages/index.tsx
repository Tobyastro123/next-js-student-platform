import Head from 'next/head';
import Layout from '../components/Layout';
import TextContainer from '../components/TextContainer';
import { motion } from 'framer-motion';
import {
  imageLandingPage,
  imageLandingPage1,
  imageWrapper,
  imageWrapper1,
} from '../variants';

type Props = {
  userObject: { username: string };
};

export default function Home(props: Props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to homepage" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div>
        <TextContainer />

        {/* image */}
        <motion.div
          variants={imageWrapper}
          initial="initial"
          animate="animate"
          className="imageWrapper"
        >
          <motion.img
            src="/images/people.jpeg"
            variants={imageLandingPage}
            className="imageLandingPage"
          />
        </motion.div>
        <motion.div
          variants={imageWrapper1}
          initial="initial"
          animate="animate"
          className="imageWrapper"
        >
          <motion.img
            src="/images/person.jpg"
            variants={imageLandingPage1}
            className="imageLandingPage1"
          />
        </motion.div>
      </div>
    </Layout>
  );
}
