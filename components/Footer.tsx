import { Interpolation, Theme } from '@emotion/react';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import { Divider } from 'semantic-ui-react';
import styles from '../styles/Home.module.css';
import { User } from '../util/database';

type Props = {
  userObject?: User;
};

function Anchor({
  children,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  css?: Interpolation<Theme>;
}) {
  return <a {...restProps}>{children}</a>;
}

export default function Footer(props: Props) {
  return (
    <footer className={styles.fixedFooter}>
      <div>
        <div className={styles.footerGrid}>
          <div>
            <h5 className={styles.footerHeader}>Quote</h5>

            <p className={styles.footerText}>
              "The senses, being the explorers of the world, open the way to
              knowledge."
            </p>
            <p className={styles.footerAuthor}>- Maria Montessori</p>
          </div>
          <div>
            <h5 className={styles.footerHeader}>Menu</h5>
            <ul>
              {!props.userObject && (
                <li className={styles.myProfileHidden}>
                  <Link href="/users/protected-user">
                    <a className={styles.footerLinks}>My Profile</a>
                  </Link>
                </li>
              )}
              {props.userObject && (
                <Link href="/users/protected-user">
                  <a className={styles.footerLinks}>My Profile</a>
                </Link>
              )}
            </ul>
            <Link href="/posts">
              <a className={styles.footerLinks}>All Posts</a>
            </Link>
          </div>
        </div>
      </div>
      <Divider />
      <div>
        © Copyright:
        <a className={styles.createdByFooter}> Olivera Kostadinoska</a>
      </div>
    </footer>
  );
}
