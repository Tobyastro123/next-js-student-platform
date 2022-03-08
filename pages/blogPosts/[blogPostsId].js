import Head from 'next/head';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import { getBlogPostsById } from '../../util/database';

export default function singleBlogPost(props) {
  return (
    <Layout>
      <div className={styles.singleProduct}>
        <div>
          <Head>
            <title>{props.blogPosts.title}</title>
            <meta name="description" content={props.blogPosts.title} />
          </Head>

          <div className={styles.singleProduct}>
            <div className={styles.singleProduct}>
              <div className={styles.singleImage}>
                <div> {props.blogPosts.title}</div>
                <div> {props.blogPosts.story} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Code in getServerSideProps runs only in
// Node.js, and allows you to do fancy things:
// - Read files from the file system
// - Connect to a (real) database
//
// getServerSideProps is exported from your files
// (ONLY FILES IN /pages) and gets imported
// by Next.js
export async function getServerSideProps(context) {
  // const addedProductsOnCookies = context.req.cookies.addedProducts || '[]';

  const blogPostsId = context.query.blogPostsId;

  const blogPosts = await getBlogPostsById(blogPostsId);

  console.log('db', blogPosts);

  // const addedProducts = JSON.parse(addedProductsOnCookies);
  // if there is no addedProducts cookie on the browser we store to an [] otherwise we get the cookie value and parse it

  // Important:
  // - Always return an object from getServerSideProps
  // - Always return a key in that object that is
  // called props

  // 1. get the cookies from the browser
  // 2. pass the cookies to the frontend
  return {
    props: {
      // In the props object, you can pass back
      // whatever information you want

      blogPosts,
    },
  };
}
