import { Blocks } from './_components/Blocks/Blocks';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.section}>
      <Blocks height={80} width={80} color="#bde153" ariaLabel="blocks-loading" />
      <p className={styles.text}>Loading…</p>
    </div>
  );
}
