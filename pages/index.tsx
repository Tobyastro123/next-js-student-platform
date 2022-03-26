import Head from 'next/head';
import Layout from '../components/Layout';
import TextContainer from '../components/TextContainer';
import { motion } from 'framer-motion';
import { image, image1, imageWrapper, imageWrapper1 } from '../variants';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to homepage" />
      </Head>
      <div>
        <TextContainer />

        {/* juice bottle image */}
        <motion.div
          variants={imageWrapper}
          initial="initial"
          animate="animate"
          className="imageWrapper"
        >
          <motion.img
            src="/images/people.jpeg"
            variants={image}
            className="image"
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
            variants={image1}
            className="image1"
          />
        </motion.div>
      </div>
    </Layout>
  );
}
