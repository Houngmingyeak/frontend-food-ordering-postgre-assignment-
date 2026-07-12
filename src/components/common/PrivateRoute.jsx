import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../store/slices/authSlice';

export default function PrivateRoute({ children }) {
  const token = useSelector(selectCurrentToken);
  return token ? children : <Navigate to="/login" replace />;
}
