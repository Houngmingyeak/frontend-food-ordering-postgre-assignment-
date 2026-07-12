import { useGetDashboardStatsQuery } from '../../store/slices/apiSlice';
import { Spinner } from '../../components/common';
import styles from './AdminDashboard.module.css';

const STAT_CARDS = [
  { key: 'totalOrders', label: 'Total Orders', icon: '📋', color: 'red' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: '⏳', color: 'yellow' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: '💰', color: 'green', isMoney: true },
  { key: 'totalCustomers', label: 'Customers', icon: '👥', color: 'blue' },
  { key: 'totalFoodItems', label: 'Food Items', icon: '🍽️', color: 'purple' },
  { key: 'totalCategories', label: 'Categories', icon: '🗂️', color: 'orange' },
];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Welcome back! Here's what's happening today.</p>

      <div className={styles.statsGrid}>
        {STAT_CARDS.map((card) => (
          <div key={card.key} className={`${styles.statCard} ${styles[card.color]}`}>
            <div className={styles.statIcon}>{card.icon}</div>
            <div>
              <div className={styles.statValue}>
                {card.isMoney ? '$' : ''}{(stats?.[card.key] ?? 0).toLocaleString()}
              </div>
              <div className={styles.statLabel}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <div className={styles.recentSection}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Order ID</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            {stats.recentOrders.map((o) => (
              <div key={o.id} className={styles.tableRow}>
                <span>#{o.id}</span>
                <span>{o.customerName}</span>
                <span>${o.totalAmount?.toFixed(2)}</span>
                <span className={styles.statusTag}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
