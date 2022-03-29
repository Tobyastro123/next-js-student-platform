import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Accordion from '../components/Accordion';

export default function StudentVisa(props) {
  return (
    <Layout userObject={props.userObject}>
      <Head>
        <title>Student Visa</title>
        <meta name="description" content="About the page" />
      </Head>
      <div className={styles.studentVisaPage}>
        <div>
          <h1>Student Visa</h1>
          <p>
            If you are coming from country that is not in European Union you are
            going to need a bunch of documents in order to apply for a student
            visa and you will need to fill out a form that is called a Student
            Visa Application Form.
            <br />
            <br />
            Please note that you will need to fill out the form in German and
            all of the information and documentation will be on German. (Even
            their website is only on German. It is pain in the ass i know 😒)
            Therefore, please keep in mind that you will need someone to come
            with you when you will personally apply for the student visa and
            also help you to fill out the form and translate for you.
            <br />
            <br />
            You will need the following documents 👇:
          </p>
        </div>
      </div>
      <div className={styles.accordionContainer}>
        <Accordion
          title="✔️ Application Form - Formular (Aufenthaltsbewilligung Student (und deren Familienangehörige) – Antrag)."
          content="This is a document where you will have to put all of your personal information."
        />
        <Accordion
          title="✔️ Valid travel document (e.g. passport) (Gültiges Reisedokument (z.B. Reisepass))."
          content="Make sure that the expiry date of your travel document is valid."
        />
        <Accordion
          title="✔️ Birth certificate or a document corresponding to it (Geburtsurkunde oder eine dieser entsprechende Urkunde)."
          content="Make sure that your birth certificate is not older then six months."
        />
        <Accordion
          title="✔️ Photo, which must not be older than six months (size: 45 x 35 mm) (Lichtbild, das nicht älter als ein halbes Jahr sein darf (Größe: 45 x 35 mm))."
          content="Make sure that your birth certificate is not older then six months."
        />
        <Accordion
          title="✔️ Proof of health insurance coverage (compulsory insurance or a corresponding insurance policy) covering all risks(Nachweis über einen Krankenversicherungsschutz (Pflichtversicherung oder eine entsprechende Versicherungspolizze), der alle Risiken abdeckt)."
          content="✔️ Make sure that you are going to apply for the social student insurance before you apply for the student visa. All information in details about the costs and documentation required to apply for the student visa can be found on the page Student Social Insurance."
        />
        <Accordion
          title="✔️ Proof of secure livelihood (in particular pay slips, wage confirmations, service contracts, confirmations of pension, annuity or other insurance benefits, proof of investment capital or own assets in sufficient amount)
          (Nachweis des gesicherten Lebensunterhalts (insbesondere Lohnzettel, Lohnbestätigungen, Dienstverträge, Bestätigungen über Pensions-, Renten- oder sonstige Versicherungsleistungen, Nachweis über Investitionskapital oder eigenes Vermögen in ausreichender Höhe))."
          content="Depending on your age, working situation and living costs, the amount of money you need to prove on your bank account can be different."
        />
        <Accordion
          title="✔️ Proof of housing contract (Nachweis eines Wohnungsvertrags)."
          content="Make sure you have a valid housing contract. Keep in mind that you are going to have to find a place to live before applying for the student visa."
        />
      </div>
    </Layout>
  );
}
