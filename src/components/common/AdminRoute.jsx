import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectIsAdmin } from '../../store/slices/authSlice';

export default function AdminRoute({ children }) {
  const token = useSelector(selectCurrentToken);
  const isAdmin = useSelector(selectIsAdmin);
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
