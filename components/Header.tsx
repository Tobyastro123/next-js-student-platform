import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { User } from '../util/database';

type Props = {
  userObject?: User;
};

export default function Header(props: Props) {
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
          <Link href="users/protected-user">
            <a>Profile</a>
          </Link>
          {props.userObject && <div>{props.userObject.username}</div>}

          {props.userObject ? (
            <a href="/logout">Logout</a>
          ) : (
            <>
              <Link href="/login">
                <a>Login</a>
              </Link>
              <Link href="/register">
                <a>Register</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
