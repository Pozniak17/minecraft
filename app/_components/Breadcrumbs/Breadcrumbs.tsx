import Link from 'next/link';

import styles from './Breadcrumbs.module.css';



export function Breadcrumbs() {

  return (

    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">

      <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> /{' '}

      <Link href="/blog/updates">Updates</Link> /{' '}

      <span className={styles.accent}>Server Update 2.6</span>

    </nav>

  );

}

