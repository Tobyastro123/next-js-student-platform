import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About</title>
        <meta name="description" content="About the page" />
      </Head>
      <div className={styles.aboutPage}>
        <div>
          <h1>Our Story</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec massa
            nulla, convallis eget pharetra eu, mattis et nunc. Fusce vel
            vulputate lorem. Pellentesque habitant morbi tristique senectus et
            netus et malesuada fames ac turpis egestas. Fusce odio nibh,
            sollicitudin et turpis vel, consectetur vehicula massa. Nam
            venenatis ultrices elit, eget consequat tellus finibus in. Proin
            ultricies, est eget volutpat blandit, arcu nisi lacinia nibh, ac
            suscipit massa felis non neque. Nam sodales nunc nunc, eu dictum
            ligula ullamcorper ut. Nulla nisl ligula, rhoncus maximus porttitor
            ut, condimentum non tellus. Cras non dolor in risus gravida
            pulvinar. Nam tortor lorem, vehicula et nisl quis, condimentum
            feugiat nibh. Curabitur vitae porttitor lacus, eget pretium ipsum.
            Integer posuere arcu magna.
          </p>
        </div>
      </div>
    </Layout>
  );
}
