import Link from 'next/link';

import styles from './Breadcrumbs.module.css';

type BreadcrumbsProps = {
  items: string[];
  links: string[];
};

export function Breadcrumbs({ items, links }: BreadcrumbsProps) {
  const [first, second, third, fourth] = items;
  const [firstLink, secondLink, thirdLink] = links;

  if (items.length === 3) {
    return (
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href={firstLink}>{first}</Link> / <Link href={secondLink}>{second}</Link> /{' '}
        <span className={styles.accent}>{third}</span>
      </nav>
    );
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <Link href={firstLink}>{first}</Link> / <Link href={secondLink}>{second}</Link> /{' '}
      <Link href={thirdLink}>{third}</Link> /{' '}
      <span className={styles.accent}>{fourth}</span>
    </nav>
  );
}
