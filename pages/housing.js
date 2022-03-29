import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Accordion from '../components/Accordion';

export default function Housing(props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Housing</title>
        <meta name="description" content="About the page" />
      </Head>
      <div className={styles.studentVisaPage}>
        <div>
          <h1>Housing / WG - Studentenheim</h1>
          <p>
            If you are a student you have the right to live in a student dorm.
            But in case you would like to live in an apartment you can also live
            in a WG or shared apartment. In most of the cases a Deposit needs to
            be paid which once you move out you are going to receive it back.
            <br />
            <br />
            Make sure that you have a contract for living and Meldezettel before
            you are going to apply for the Visa.
            <br />
            <br />
            You can find links of the websites bellow 👇:
          </p>
        </div>
      </div>
      <div className={styles.accordionContainer}>
        <Accordion
          title="✔️ List of a student dormitories - (Studentenheime)."
          content="https://www.iamstudent.at/blog/studentenheime-wien/"
        />
        <Accordion
          title="✔️ Shared apartments - (WG)."
          content="https://www.wg-gesucht.de/"
        />
      </div>
    </Layout>
  );
}
