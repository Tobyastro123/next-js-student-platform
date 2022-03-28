import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

export default function OurStory(props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Our Story</title>
        <meta name="description" content="About the page" />
      </Head>
      <div className={styles.aboutPage}>
        <div>
          <h1>Our Story</h1>
          <p>
            Hey friends! 🙋‍♀️
            <br />
            <br />
            Our purpose behind Student for Student is building a community of
            students who are passionate about sharing their knowledge and
            experiences with other students in order to help them grow and
            learn, make friends, and have fun while doing so.
            <br />
            <br />I remember the first days at the University of Vienna how lost
            i felt and searching for information felt hard and complicated.
            Therefore, was always wondering if there is a place where i could
            find everything i needed without so much effort. That is how the
            idea of Student for Student came to be. <br />
            <br />
            Hope it would make things easier for you and you will enjoy it! ✌️
          </p>
        </div>
      </div>
    </Layout>
  );
}
