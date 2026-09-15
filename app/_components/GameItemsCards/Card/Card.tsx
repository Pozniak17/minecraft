'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { productIconUrl } from '@/lib/products/iconUrl';
import styles from './Card.module.css';

type CardProps = {
  title: string;
  imageName: string;
  shopHref?: string;
  price?: string;
  onAdd?: () => void;
  pending?: boolean;
  done?: boolean;
};

export default function Card({
  title,
  imageName,
  shopHref,
  price,
  onAdd,
  pending = false,
  done = false,
}: CardProps) {
  const t = useTranslations('store');
  const isShop = Boolean(onAdd);

  const buttonLabel = pending
    ? t('privCard_adding')
    : done
      ? t('privCard_added')
      : isShop
        ? t('privCard_addToCart')
        : t('gameItems_buy');

  const actionClass = `${styles.button} ${done ? styles.buttonDone : ''}`;

  return (
    <li className={styles.item}>
      <article className={styles.card}>
        <div className={styles.iconWrap}>
          <Image
            className={styles.icon}
            src={productIconUrl(imageName)}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1280px) 190px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{title}</h3>
          {price && <p className={styles.price}>{price}</p>}
          {onAdd ? (
            <button
              type="button"
              className={actionClass}
              onClick={onAdd}
              disabled={pending}
              aria-label={`${buttonLabel}: ${title}`}
            >
              <Image
                src="/icons/icons/arrow-up.svg"
                alt=""
                width={14}
                height={14}
                aria-hidden
              />
              {buttonLabel}
            </button>
          ) : (
            shopHref && (
              <Link
                href={shopHref}
                className={actionClass}
                aria-label={`${buttonLabel}: ${title}`}
              >
                <Image
                  src="/icons/icons/arrow-up.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden
                />
                {buttonLabel}
              </Link>
            )
          )}
        </div>
      </article>
    </li>
  );
}
