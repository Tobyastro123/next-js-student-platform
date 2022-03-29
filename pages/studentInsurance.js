import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Accordion from '../components/Accordion';

export default function StudentVisa(props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Student Insurance</title>
        <meta name="description" content="About the page" />
      </Head>
      <div className={styles.studentVisaPage}>
        <div>
          <h1>Student Insurance / Selbst­ver­sich­erung für Studierende</h1>
          <p>
            If you are a student and you are not working then you have the right
            for student insurance or Selbst­ver­sich­erung für Studierende.
            <br />
            <br />
            Please make sure you collect all the documents mentioned below and
            fill up the form before you go to apply for the student insurance.
            You can apply for it in WGKK office near to where you live.
            <br />
            <br />
            The insurance costs EUR 64,78 per month. (2022)
            <br />
            <br />
            You will need the following documents 👇:
          </p>
        </div>
      </div>
      <div className={styles.accordionContainer}>
        <Accordion
          title="✔️ Fully completed and signed application form - (Vollständig ausgefülltes und unterschriebenes Antragsformular)."
          content="This is a document where you will have to put all of your personal information."
        />
        <Accordion
          title="✔️ Photo ID (Lichtbildausweis)."
          content="Make sure that your photo is not older then six months."
        />
        <Accordion
          title="✔️ Confirmation of registration (Meldezettel) (Meldebestätigung (Meldezettel)."
          content="Make sure after you find a place to live and have a contract to sign in yourself in the Bezirk where you live and take the Meldezettel."
        />
        <Accordion
          title="✔️ Current study sheet/confirmation of study period Aktuelles Studienblatt/Studienzeitbestätigung)."
          content="You can download this document from your account on the University website (moodle for example)."
        />
      </div>
      <div className={styles.websiteLinkStudentVisa}>
        <p>Official website for student insurance documentation:</p>
        <a>
          https://www.gesundheitskasse.at/cdscontent/?contentid=10007.868713&portal=oegkportal
        </a>
      </div>
    </Layout>
  );
}
