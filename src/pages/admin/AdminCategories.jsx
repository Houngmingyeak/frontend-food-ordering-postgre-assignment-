import { useState } from 'react';
import {
  useGetCategoriesQuery, useCreateCategoryMutation,
  useUpdateCategoryMutation, useDeleteCategoryMutation,
} from '../../store/slices/apiSlice';
import { Modal, Spinner, EmptyState, Pagination } from '../../components/common';
import { useToast } from '../../hooks/useToast';
import styles from './AdminCategories.module.css';

export default function AdminCategories() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useGetCategoriesQuery({ page, size: 10 });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory({ id: editing.id, ...form }).unwrap();
        showToast('Category updated!');
      } else {
        await createCategory(form).unwrap();
        showToast('Category created!');
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err?.data?.message || 'Something went wrong.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Food items linked to it may be affected.')) return;
    try {
      await deleteCategory(id).unwrap();
      showToast('Category deleted.');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete.', 'error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>Organize your menu into categories</p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>+ Add Category</button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : data?.content?.length === 0 ? (
        <EmptyState icon="🗂️" message="No categories yet. Create your first one!" />
      ) : (
        <>
          <div className={styles.grid}>
            {data.content.map((cat) => (
              <div key={cat.id} className={styles.card}>
                <div className={styles.cardIcon}>🗂️</div>
                <div className={styles.cardBody}>
                  <div className={styles.cardName}>{cat.name}</div>
                  <div className={styles.cardDesc}>{cat.description || 'No description'}</div>
                  <div className={styles.cardMeta}>{cat.foodCount ?? 0} items</div>
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => openEdit(cat)} title="Edit">✏️</button>
                  <button onClick={() => handleDelete(cat.id)} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={data?.totalPages} onChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Pizza, Drinks..."
              required
            />
          </div>
          <div className={styles.field}>
            <label>Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description..."
              rows={3}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={isCreating || isUpdating}>
              {editing ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
