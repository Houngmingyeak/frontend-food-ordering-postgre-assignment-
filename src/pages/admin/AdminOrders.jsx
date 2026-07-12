import { useState } from 'react';
import {
  useGetAllOrdersQuery, useUpdateOrderStatusMutation,
} from '../../store/slices/apiSlice';
import { Spinner, EmptyState, Pagination, Badge, Select } from '../../components/common';
import { useToast } from '../../hooks/useToast';
import { ORDER_STATUS_OPTIONS } from '../../utils/constants';
import styles from './AdminOrders.module.css';

const STATUS_VARIANT = {
  PENDING: 'warning', PROCESSING: 'info',
  DELIVERED: 'success', CANCELLED: 'danger',
};

export default function AdminOrders() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAllOrdersQuery({ page, size: 12, status: statusFilter || undefined });
  const [updateStatus] = useUpdateOrderStatusMutation();
  const { showToast } = useToast();

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateStatus({ id: orderId, status }).unwrap();
      showToast(`Order #${orderId} marked as ${status}`);
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update status.', 'error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.subtitle}>Manage and track customer orders</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className={styles.filterSelect}
        >
          <option value="">All statuses</option>
          {ORDER_STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Spinner />
      ) : data?.content?.length === 0 ? (
        <EmptyState icon="📋" message="No orders found." />
      ) : (
        <>
          <div className={styles.orders}>
            {data.content.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <div>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.customer}>{order.customerName}</span>
                  </div>
                  <Badge variant={STATUS_VARIANT[order.status] || 'default'}>{order.status}</Badge>
                </div>

                <div className={styles.itemsList}>
                  {order.items.map((item) => (
                    <span key={item.id} className={styles.itemChip}>
                      {item.quantity}× {item.foodName}
                    </span>
                  ))}
                </div>

                <div className={styles.orderBottom}>
                  <span className={styles.date}>{new Date(order.createdAt).toLocaleString()}</span>
                  <span className={styles.total}>${order.totalAmount?.toFixed(2)}</span>
                  <select
                    className={styles.statusSelect}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={order.status === 'CANCELLED'}
                  >
                    {ORDER_STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={data?.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
