import { useState } from 'react';
import {
  useGetFoodsQuery, useGetCategoriesQuery,
  useCreateFoodMutation, useUpdateFoodMutation, useDeleteFoodMutation,
} from '../../store/slices/apiSlice';
import { Modal, Spinner, EmptyState, Pagination, Badge } from '../../components/common';
import { useToast } from '../../hooks/useToast';
import { IMAGE_BASE } from '../../utils/constants';
import styles from './AdminFoods.module.css';

const EMPTY_FORM = {
  name: '', description: '', price: '', categoryId: '', available: true,
};

export default function AdminFoods() {
  const [page, setPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const { data, isLoading } = useGetFoodsQuery({ page, size: 10, categoryId: categoryFilter || undefined });
  const { data: catData } = useGetCategoriesQuery({ size: 100 });
  const [createFood, { isLoading: isCreating }] = useCreateFoodMutation();
  const [updateFood, { isLoading: isUpdating }] = useUpdateFoodMutation();
  const [deleteFood] = useDeleteFoodMutation();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (food) => {
    setEditing(food);
    setForm({
      name: food.name,
      description: food.description || '',
      price: food.price,
      categoryId: food.categoryId,
      available: food.available,
    });
    setImageFile(null);
    setImagePreview(food.imageName ? `${IMAGE_BASE}/${food.imageName}` : null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('categoryId', form.categoryId);
    fd.append('available', form.available);
    if (imageFile) fd.append('image', imageFile);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = buildFormData();
      if (editing) {
        await updateFood({ id: editing.id, formData }).unwrap();
        showToast('Food item updated!');
      } else {
        await createFood(formData).unwrap();
        showToast('Food item created!');
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err?.data?.message || 'Something went wrong.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await deleteFood(id).unwrap();
      showToast('Food item deleted.');
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete.', 'error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Food Items</h1>
          <p className={styles.subtitle}>Manage your menu items</p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>+ Add Food Item</button>
      </div>

      <div className={styles.filterBar}>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
          className={styles.filterSelect}
        >
          <option value="">All categories</option>
          {catData?.content?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Spinner />
      ) : data?.content?.length === 0 ? (
        <EmptyState icon="🍽️" message="No food items yet. Add your first dish!" />
      ) : (
        <>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Image</span>
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {data.content.map((food) => (
              <div key={food.id} className={styles.tableRow}>
                <div className={styles.thumbWrap}>
                  {food.imageName ? (
                    <img src={`${IMAGE_BASE}/${food.imageName}`} alt={food.name} />
                  ) : (
                    <span>🍽️</span>
                  )}
                </div>
                <span className={styles.foodName}>{food.name}</span>
                <span className={styles.muted}>{food.categoryName}</span>
                <span className={styles.price}>${food.price?.toFixed(2)}</span>
                <Badge variant={food.available ? 'success' : 'danger'}>
                  {food.available ? 'Available' : 'Hidden'}
                </Badge>
                <div className={styles.actions}>
                  <button onClick={() => openEdit(food)} title="Edit">✏️</button>
                  <button onClick={() => handleDelete(food.id)} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={data?.totalPages} onChange={setPage} />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Food Item' : 'New Food Item'} width={560}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.imageUpload}>
            <label htmlFor="food-image" className={styles.imageDrop}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" />
              ) : (
                <span>📷 Click to upload image</span>
              )}
            </label>
            <input id="food-image" type="file" accept="image/*" onChange={handleImageChange} hidden />
          </div>

          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Classic Burger" required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Price ($)</label>
              <input
                type="number" step="0.01" min="0" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00" required
              />
            </div>
            <div className={styles.field}>
              <label>Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {catData?.content?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ingredients, taste, portion size..."
              rows={3}
            />
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
            />
            Available for ordering
          </label>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={isCreating || isUpdating}>
              {editing ? 'Save Changes' : 'Create Food Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
