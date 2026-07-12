import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/foods', label: 'Food Items', icon: '🍽️' },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
  { to: '/admin/users', label: 'Customers', icon: '👥' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.logoMark}>F</span>
          {!collapsed && <span className={styles.logoText}>Fla<em>vr</em> Admin</span>}
        </div>

        <nav className={styles.sideNav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.sideLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          {!collapsed && (
            <div className={styles.adminInfo}>
              <div className={styles.adminAvatar}>
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <div className={styles.adminName}>{user?.name}</div>
                <div className={styles.adminRole}>Administrator</div>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            🚪
          </button>
        </div>
      </aside>

      <div className={styles.content}>
        <header className={styles.topbar}>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
          <span className={styles.breadcrumb}>Admin Panel</span>
        </header>
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
