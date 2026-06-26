import { getTranslations } from 'next-intl/server';
import { Blocks } from './_components/Blocks/Blocks';
import styles from './loading.module.css';

export default async function Loading() {
  const t = await getTranslations('system');

  return (
    <div className={styles.section}>
      <Blocks height={80} width={80} color="#bde153" ariaLabel={t('loading_ariaLabel')} />
      <p className={styles.text}>{t('loading_text')}</p>
    </div>
  );
}
