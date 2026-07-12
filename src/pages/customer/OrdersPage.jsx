import { useState } from 'react';
import { useGetMyOrdersQuery, useCancelOrderMutation } from '../../store/slices/apiSlice';
import { Spinner, Badge, Pagination, EmptyState } from '../../components/common';
import styles from './OrdersPage.module.css';

const STATUS_VARIANT = {
  PENDING: 'warning', PROCESSING: 'info',
  DELIVERED: 'success', CANCELLED: 'danger',
};

export default function OrdersPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetMyOrdersQuery({ page, size: 10 });
  const [cancelOrder] = useCancelOrderMutation();

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this order?')) {
      await cancelOrder(id);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Orders</h1>
      {isLoading ? (
        <Spinner />
      ) : data?.content?.length === 0 ? (
        <EmptyState icon="📋" message="No orders yet. Go place your first order!" />
      ) : (
        <>
          <div className={styles.orders}>
            {data.content.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderId}>Order #{order.id}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant={STATUS_VARIANT[order.status] || 'default'}>
                    {order.status}
                  </Badge>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <span className={styles.qty}>×{item.quantity}</span>
                      <span className={styles.itemName}>{item.foodName}</span>
                      <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <span className={styles.orderTotal}>
                    Total: <strong>${order.totalAmount?.toFixed(2)}</strong>
                  </span>
                  {order.status === 'PENDING' && (
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel
                    </button>
                  )}
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
