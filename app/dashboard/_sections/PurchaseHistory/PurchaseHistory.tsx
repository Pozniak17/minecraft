'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/api/orders';
import type { OrderListItem } from '@/lib/api/types';
import styles from './PurchaseHistory.module.css';

type OrderStatus = 'paid' | 'refund' | 'failed';

type Order = {
  id: string;
  date: string;
  player: string;
  server: string;
  total: string;
  status: OrderStatus;
  items: string[];
};

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

function itemLabel(imageName: string | undefined): string {
  if (!imageName) return 'Item';
  const base = imageName.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  const cleaned = base.replace(/[-_]+/g, ' ').trim();
  return cleaned || 'Item';
}

function mapOrder(order: OrderListItem): Order {
  const first = order.order_item?.[0];
  const created = first?.created ? new Date(first.created) : null;
  const currency = first?.currency ? ` ${first.currency}` : '';

  return {
    id: order.id,
    date: created ? dateFmt.format(created).replace(',', '') : '—',
    player: order.user_nickname ?? '—',
    server: order.server ?? '—',
    total: `${order.total_price}${currency}`,
    status: 'paid',
    items: (order.order_item ?? []).map(
      oi => `${itemLabel(oi.image_name)} ×${oi.amount}`
    ),
  };
}

const STATS = [
  {
    labelMobile: 'Orders',
    labelDesktop: 'Orders',
    valueMobile: '24',
    valueDesktop: '24',
    icon: '/profile/purchase_history/1.svg',
  },
  {
    labelMobile: 'Spent',
    labelDesktop: 'Total spent',
    valueMobile: '$248',
    valueDesktop: '$248.92',
    icon: '/profile/purchase_history/2.svg',
  },
  {
    labelMobile: 'Crystals',
    labelDesktop: 'Crystals bought',
    valueMobile: '12.5k',
    valueDesktop: '12,500',
    icon: '/profile/purchase_history/3.svg',
  },
  {
    labelMobile: 'Privileges',
    labelDesktop: 'Privileges',
    valueMobile: '3',
    valueDesktop: '3 active',
    icon: '/profile/purchase_history/4.svg',
  },
] as const;

const PERIODS = ['Last 90 days', 'Last 30 days', 'Last 7 days', 'All time'] as const;

const ORDERS: Order[] = [
  {
    id: '1',
    date: 'May 18 2026',
    player: 'RedstoneKing',
    server: 'Classic',
    total: '$37.96',
    status: 'paid',
    items: ['Diamond privilege ×1', 'Crystals 2,500 ×1'],
  },
  {
    id: '2',
    date: 'May 12 2026',
    player: 'RedstoneKing',
    server: 'Skyblock',
    total: '$3.99',
    status: 'paid',
    items: ['Cosmetic pack 2 ×1'],
  },
  {
    id: '3',
    date: 'May 04 2026',
    player: 'RedstoneKing',
    server: 'Classic',
    total: '$39.99',
    status: 'paid',
    items: ['Crystals 5,000 ×1'],
  },
  {
    id: '4',
    date: 'Apr 27 2026',
    player: 'RedstoneKing',
    server: 'Skyblock',
    total: '$5.99',
    status: 'refund',
    items: ['Gold privilege ×1'],
  },
  {
    id: '5',
    date: 'Apr 18 2026',
    player: 'RedstoneKing',
    server: 'Classic',
    total: '$9.98',
    status: 'paid',
    items: ['Crystals 500 ×2'],
  },
  {
    id: '6',
    date: 'Apr 02 2026',
    player: 'RedstoneKing',
    server: 'Anarchy',
    total: '$2.50',
    status: 'failed',
    items: ['Tournament entry ×1'],
  },
];

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
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('Last 90 days');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  useEffect(() => {
    let active = true;
    getOrders(1, 50)
      .then(data => {
        if (!active || data.results.length === 0) return;
        setOrders(data.results.map(mapOrder));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
            <button type="button" className={styles.exportBtn}>
              <span>Export CSV</span>
              <Image
                src="/profile/purchase_history/5.svg"
                alt=""
                width={13}
                height={14}
                className={styles.exportIcon}
                aria-hidden
              />
            </button>
          </div>
        </header>

        <div className={styles.periodMobile}>{periodControl}</div>

        <div className={styles.stats}>
          {STATS.map(stat => (
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
                <span className={styles.statValueMobile}>{stat.valueMobile}</span>
                <span className={styles.statValueDesktop}>{stat.valueDesktop}</span>
              </div>
            </div>
          ))}
        </div>

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
                <button type="button" className={styles.openBtn}>
                  Open
                </button>
                <button type="button" className={styles.receiptBtn}>
                  <span>Receipt</span>
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
                    <button type="button" className={styles.tableOpenBtn}>
                      Open
                    </button>
                    <button type="button" className={styles.tableReceiptBtn} aria-label="Download receipt">
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
      </div>
    </div>
  );
}
