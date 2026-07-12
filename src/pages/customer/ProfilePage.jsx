import { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/slices/apiSlice';
import { Spinner } from '../../components/common';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm({ name: profile.name || '', email: profile.email || '', phone: profile.phone || '', address: profile.address || '' });
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form).unwrap();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Profile</h1>
      <div className={styles.card}>
        <div className={styles.avatar}>
          {form.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className={styles.avatarName}>{profile?.name}</div>
        <div className={styles.avatarEmail}>{profile?.email}</div>

        {saved && <div className={styles.successBanner}>✅ Profile updated!</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Full name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Phone</label>
              <input type="tel" value={form.phone} placeholder="e.g. +855 12 345 678" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Delivery address</label>
              <input type="text" value={form.address} placeholder="Street, city..." onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
