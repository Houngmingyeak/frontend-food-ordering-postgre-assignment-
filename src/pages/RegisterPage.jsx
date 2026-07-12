import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../store/slices/apiSlice';
import { setCredentials } from '../store/slices/authSlice';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      navigate('/');
    } catch (err) {
      setError(err?.data?.message || 'Registration failed. Try again.');
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoMark}>F</div>
          <span className={styles.logoText}>Fla<em>vr</em></span>
        </div>

        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Join Flavr and start ordering</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Full name</label>
            <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')} required />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
          </div>
          <div className={styles.field}>
            <label>Confirm password</label>
            <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
          </div>
          <button className={styles.submitBtn} type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
