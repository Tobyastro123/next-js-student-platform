import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Header() {
  return (
    <nav>
      <div id={styles.menuToggle}>
        <input type="checkbox" />
        <span />
        <span />
        <span />
        <ul id={styles.menu}>
          <Link href="/studentVisa">
            <a>Student Visa</a>
          </Link>
          <Link href="/studentInsurance">
            <a>Student Insurance</a>
          </Link>
          <Link href="/aufenthaltstitel">
            <a>Aufenthaltstitel</a>
          </Link>
        </ul>
      </div>
      <div className={styles.navBarContainer}>
        <div className={styles.logo}>
          <Link href="/">
            <a>Student for Student</a>
          </Link>
        </div>
        <div className={styles.navBar}>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/blogPostList">
            <a>Blog</a>
          </Link>
          <Link href="/ourStory">
            <a>Our Story</a>
          </Link>
          <Link href="/register">
            <a>Register</a>
          </Link>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
