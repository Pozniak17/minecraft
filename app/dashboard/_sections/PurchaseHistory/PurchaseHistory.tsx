'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { getOrders, downloadOrderBill, openOrderBill, orderHasBill } from '@/lib/api/orders';
import { getProducts } from '@/lib/api/shop';
import type { OrderListItem } from '@/lib/api/types';
import styles from './PurchaseHistory.module.css';

// product_id → метадані товару (назва + чи це кристали) з каталогу бекенду.
type ProductMeta = { title: string; isCrystal: boolean };

type OrderStatus = 'paid' | 'refund' | 'failed';

type Order = {
  id: string;
  date: string;
  player: string;
  server: string;
  total: string;
  status: OrderStatus;
  items: string[];
  hasBill: boolean;
};

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

const nf = new Intl.NumberFormat('en-US');

function itemLabel(imageName: string | undefined): string {
  if (!imageName) return 'Item';
  const base = imageName.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  const cleaned = base.replace(/[-_]+/g, ' ').trim();
  return cleaned || 'Item';
}

// Назва позиції: спершу реальна назва товару з каталогу, далі фолбек на image_name.
function itemTitle(productId: string, imageName: string | undefined, meta: Map<string, ProductMeta>): string {
  return meta.get(productId)?.title || itemLabel(imageName);
}

// Бекенд віддає decimal з 8 знаками ("420.00000000") — показуємо рівно 2 знаки.
function formatAmount(value: string | number | undefined, currency: string): string {
  const num = Number(value) || 0;
  return `${num.toFixed(2)} ${currency}`;
}

function mapOrder(order: OrderListItem, meta: Map<string, ProductMeta>): Order {
  const first = order.order_item?.[0];
  const created = first?.created ? new Date(first.created) : null;
  const currency = first?.currency ?? 'EUR';

  return {
    id: order.id,
    date: created ? dateFmt.format(created).replace(',', '') : '—',
    player: order.user_nickname ?? '—',
    server: order.server ?? '—',
    total: formatAmount(order.total_price, currency),
    status: 'paid',
    items: (order.order_item ?? []).map(
      oi => `${itemTitle(oi.product_id, oi.image_name, meta)} ×${oi.amount}`
    ),
    hasBill: orderHasBill(order),
  };
}

const PERIODS = ['Last 90 days', 'Last 30 days', 'Last 7 days', 'All time'] as const;

const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: 'paid',
  refund: 'refund',
  failed: 'failed',
};

function splitDate(date: string) {
  const parts = date.split(' ');
  if (parts.length >= 3) {
    return { month: parts[0], dayYear: `${parts[1]} ${parts[2]}` };
  }
  return { month: date, dayYear: '' };
}

export default function PurchaseHistory() {
  const locale = useLocale();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Last 90 days');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [rawOrders, setRawOrders] = useState<OrderListItem[]>([]);
  const [productMeta, setProductMeta] = useState<Map<string, ProductMeta>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleOpenReceipt(orderId: string) {
    setOpeningId(orderId);
    setDownloadError(null);
    try {
      await openOrderBill(orderId);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Could not open receipt.');
    } finally {
      setOpeningId(null);
    }
  }

  async function handleDownloadReceipt(orderId: string) {
    setDownloadingId(orderId);
    setDownloadError(null);
    try {
      await downloadOrderBill(orderId);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Could not download receipt.');
    } finally {
      setDownloadingId(null);
    }
  }

  useEffect(() => {
    let active = true;
    getOrders(1, 50)
      .then(data => {
        if (!active) return;
        setRawOrders(data.results);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Каталог товарів: даємо позиціям реальну назву та визначаємо кристали за категорією.
  useEffect(() => {
    let active = true;
    getProducts({ page_size: 100, lang: locale })
      .then(data => {
        if (!active) return;
        const map = new Map<string, ProductMeta>();
        for (const p of data.results) {
          map.set(p.id, {
            title: p.title ?? '',
            isCrystal: p.category_slug === 'crystals',
          });
        }
        setProductMeta(map);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [locale]);

  const orders = useMemo(
    () => rawOrders.map(order => mapOrder(order, productMeta)),
    [rawOrders, productMeta]
  );

  // Статистика рахується з реальних замовлень (а не фіксовані числа).
  const stats = useMemo(() => {
    let spent = 0;
    let crystals = 0;
    let privileges = 0;
    let currency = 'EUR';

    for (const order of rawOrders) {
      spent += Number(order.total_price) || 0;
      for (const item of order.order_item ?? []) {
        if (item.currency) currency = item.currency;
        // Кристали визначаємо за категорією товару (image_name з бекенду — null).
        if (productMeta.get(item.product_id)?.isCrystal) {
          crystals += item.amount;
        } else {
          privileges += 1;
        }
      }
    }

    const spentFmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });

    return [
      {
        labelMobile: 'Orders',
        labelDesktop: 'Orders',
        value: nf.format(rawOrders.length),
        icon: '/profile/purchase_history/1.svg',
      },
      {
        labelMobile: 'Spent',
        labelDesktop: 'Total spent',
        value: spentFmt.format(spent),
        icon: '/profile/purchase_history/2.svg',
      },
      {
        labelMobile: 'Crystals',
        labelDesktop: 'Crystals bought',
        value: nf.format(crystals),
        icon: '/profile/purchase_history/3.svg',
      },
      {
        labelMobile: 'Privileges',
        labelDesktop: 'Privileges',
        value: nf.format(privileges),
        icon: '/profile/purchase_history/4.svg',
      },
    ];
  }, [rawOrders, productMeta]);

  const isEmpty = loaded && orders.length === 0;

  const periodControl = (
    <div className={styles.periodWrap}>
      <button
        type="button"
        className={styles.periodBtn}
        onClick={() => setPeriodOpen(open => !open)}
        aria-expanded={periodOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.periodLabel}>
          <span className={styles.periodPrefix}>Period:</span>
          <span className={styles.periodValue}>{period}</span>
        </span>
        <span className={styles.periodCaret} aria-hidden>
          ▾
        </span>
      </button>
      {periodOpen && (
        <ul className={styles.periodMenu} role="listbox" aria-label="Select period">
          {PERIODS.map(option => (
            <li key={option} role="option" aria-selected={period === option}>
              <button
                type="button"
                className={styles.periodOption}
                onClick={() => {
                  setPeriod(option);
                  setPeriodOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.eyebrow}>History</span>
            <h1 className={styles.title}>Purchase history</h1>
            <p className={styles.subtitle}>
              Every order across every server. Open or download receipts any time.
            </p>
          </div>
          <div className={styles.toolbar}>
            {periodControl}
          </div>
        </header>

        <div className={styles.periodMobile}>{periodControl}</div>

        {downloadError ? <p className={styles.stateNote}>{downloadError}</p> : null}

        <div className={styles.stats}>
          {stats.map(stat => (
            <div key={stat.labelDesktop} className={styles.statCard}>
              <div className={styles.statIconWrap}>
                <Image
                  src={stat.icon}
                  alt=""
                  width={24}
                  height={24}
                  className={styles.statIcon}
                  aria-hidden
                />
              </div>
              <div className={styles.statCopy}>
                <span className={styles.statLabelMobile}>{stat.labelMobile}</span>
                <span className={styles.statLabelDesktop}>{stat.labelDesktop}</span>
                <span className={styles.statValueMobile}>{stat.value}</span>
                <span className={styles.statValueDesktop}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {!loaded ? (
          <p className={styles.stateNote}>Loading your orders…</p>
        ) : isEmpty ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No orders yet</p>
            <p className={styles.emptyText}>
              Your purchases will appear here once you complete your first order.
            </p>
            <Link href="/dashboard/shop" className={styles.emptyCta}>
              Go to shop →
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.orderList}>
              {orders.map(order => (
                <li key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHead}>
                    <div className={styles.orderMeta}>
                      <p className={styles.orderDate}>{order.date}</p>
                      <p className={styles.orderContext}>
                        {order.player} • {order.server}
                      </p>
                    </div>
                    <div className={styles.orderTotal}>
                      <p className={styles.orderPrice}>{order.total}</p>
                      <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>
                  </div>

                  <ul className={styles.itemList}>
                    {order.items.map(item => (
                      <li key={item} className={styles.itemRow}>
                        <span className={styles.itemDot} aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.orderActions}>
                    <button
                      type="button"
                      className={styles.openBtn}
                      disabled={!order.hasBill || openingId === order.id || downloadingId === order.id}
                      onClick={() => handleOpenReceipt(order.id)}
                    >
                      {openingId === order.id ? 'Opening…' : 'Open'}
                    </button>
                    <button
                      type="button"
                      className={styles.receiptBtn}
                      disabled={!order.hasBill || downloadingId === order.id || openingId === order.id}
                      onClick={() => handleDownloadReceipt(order.id)}
                    >
                      <span>{downloadingId === order.id ? 'Downloading…' : 'Receipt'}</span>
                      <Image
                        src="/profile/purchase_history/5.svg"
                        alt=""
                        width={13}
                        height={14}
                        className={styles.receiptIcon}
                        aria-hidden
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.table} role="table" aria-label="Purchase history">
              <div className={styles.tableHead} role="row">
                <span className={styles.colDate} role="columnheader">
                  Date
                </span>
                <span className={styles.colItems} role="columnheader">
                  Items
                </span>
                <span className={styles.colServer} role="columnheader">
                  Server
                </span>
                <span className={styles.colNickname} role="columnheader">
                  Nickname
                </span>
                <span className={styles.colAmount} role="columnheader">
                  Amount
                </span>
                <span className={styles.colStatus} role="columnheader">
                  Status
                </span>
                <span className={styles.colReceipt} role="columnheader">
                  Receipt
                </span>
              </div>

              {orders.map(order => {
                const { month, dayYear } = splitDate(order.date);

                return (
                  <div key={order.id} className={styles.tableRow} role="row">
                    <div className={styles.colDate} role="cell">
                      <p className={styles.tableDateMonth}>{month}</p>
                      <p className={styles.tableDateDay}>{dayYear}</p>
                    </div>
                    <div className={styles.colItems} role="cell">
                      <ul className={styles.tableItemList}>
                        {order.items.map(item => (
                          <li key={item} className={styles.tableItemRow}>
                            <span className={styles.itemDot} aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.colServer} role="cell">
                      <span className={styles.serverBadge}>{order.server}</span>
                    </div>
                    <div className={styles.colNickname} role="cell">
                      <span className={styles.tableNickname}>{order.player}</span>
                    </div>
                    <div className={styles.colAmount} role="cell">
                      <span className={styles.tableAmount}>{order.total}</span>
                    </div>
                    <div className={styles.colStatus} role="cell">
                      <span
                        className={`${styles.statusBadge} ${styles.statusBadgeDot} ${styles[`status_${order.status}`]}`}
                      >
                        <span className={styles.statusDot} aria-hidden />
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>
                    <div className={styles.colReceipt} role="cell">
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.tableOpenBtn}
                          disabled={!order.hasBill || openingId === order.id || downloadingId === order.id}
                          onClick={() => handleOpenReceipt(order.id)}
                        >
                          {openingId === order.id ? 'Opening…' : 'Open'}
                        </button>
                        <button
                          type="button"
                          className={styles.tableReceiptBtn}
                          aria-label="Download receipt"
                          disabled={!order.hasBill || downloadingId === order.id || openingId === order.id}
                          onClick={() => handleDownloadReceipt(order.id)}
                        >
                          <Image
                            src="/profile/purchase_history/5.svg"
                            alt=""
                            width={13}
                            height={14}
                            className={styles.receiptIcon}
                            aria-hidden
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
