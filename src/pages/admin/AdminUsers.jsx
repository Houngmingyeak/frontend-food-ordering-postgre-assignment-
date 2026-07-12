import { useState } from 'react';
import { useGetAllUsersQuery, useToggleBlockUserMutation } from '../../store/slices/apiSlice';
import { Spinner, EmptyState, Pagination, Badge } from '../../components/common';
import { useToast } from '../../hooks/useToast';
import styles from './AdminUsers.module.css';

export default function AdminUsers() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetAllUsersQuery({ page, size: 12 });
  const [toggleBlock] = useToggleBlockUserMutation();
  const { showToast } = useToast();

  const handleToggle = async (user) => {
    const action = user.blocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;
    try {
      await toggleBlock(user.id).unwrap();
      showToast(`${user.name} has been ${action}ed.`);
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update user.', 'error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customers</h1>
        <p className={styles.subtitle}>View and manage customer accounts</p>
      </div>

      {isLoading ? (
        <Spinner />
      ) : data?.content?.length === 0 ? (
        <EmptyState icon="👥" message="No customers found." />
      ) : (
        <>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Customer</span>
              <span>Email</span>
              <span>Orders</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {data.content.map((user) => (
              <div key={user.id} className={styles.tableRow}>
                <div className={styles.userCell}>
                  <div className={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                  <span>{user.name}</span>
                </div>
                <span className={styles.email}>{user.email}</span>
                <span className={styles.orderCount}>{user.orderCount ?? 0}</span>
                <Badge variant={user.blocked ? 'danger' : 'success'}>
                  {user.blocked ? 'Blocked' : 'Active'}
                </Badge>
                <button
                  className={`${styles.toggleBtn} ${user.blocked ? styles.unblock : styles.block}`}
                  onClick={() => handleToggle(user)}
                >
                  {user.blocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={data?.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
