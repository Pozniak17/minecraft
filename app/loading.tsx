import { getTranslations } from 'next-intl/server';
import { Blocks } from './_components/Blocks/Blocks';

export default async function Loading() {
  const t = await getTranslations('system');

  return (
    <div style={sectionStyle}>
      <Blocks height={80} width={80} color="#bde153" ariaLabel={t('loading_ariaLabel')} />
      <p style={textStyle}>{t('loading_text')}</p>
    </div>
  );
}

const sectionStyle = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '18px',
  width: '100%',
  minHeight: 'calc(100dvh - var(--header-height))',
  padding: 'var(--header-height) 20px 40px',
  backgroundColor: 'var(--color-bg-effect)',
  textAlign: 'center',
} as const;

const textStyle = {
  color: 'rgba(255, 255, 255, 0.66)',
  fontFamily: 'var(--font-main)',
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: 'normal',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
} as const;
