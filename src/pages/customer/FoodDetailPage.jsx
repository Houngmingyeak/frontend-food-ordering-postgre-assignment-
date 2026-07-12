import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetFoodByIdQuery } from '../../store/slices/apiSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { IMAGE_BASE } from '../../utils/constants';
import { Spinner } from '../../components/common';
import { useToast } from '../../hooks/useToast';
import styles from './FoodDetailPage.module.css';

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { data: food, isLoading, isError } = useGetFoodByIdQuery(id);
  const [qty, setQty] = useState(1);

  if (isLoading) return <Spinner />;
  if (isError || !food) {
    return (
      <div className={styles.notFound}>
        <h2>Food item not found</h2>
        <Link to="/menu" className={styles.backLink}>← Back to menu</Link>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      dispatch(addToCart({
        foodId: food.id,
        name: food.name,
        price: food.price,
        image: food.imageName,
      }));
    }
    showToast(`${qty} × ${food.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate('/cart');
  };

  return (
    <div className={styles.page}>
      <Link to="/menu" className={styles.backLink}>← Back to menu</Link>

      <div className={styles.layout}>
        <div className={styles.imgWrap}>
          {food.imageName ? (
            <img src={`${IMAGE_BASE}/${food.imageName}`} alt={food.name} />
          ) : (
            <span className={styles.placeholder}>🍽️</span>
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.category}>{food.categoryName}</div>
          <h1 className={styles.name}>{food.name}</h1>
          <div className={styles.price}>${food.price?.toFixed(2)}</div>
          <p className={styles.desc}>{food.description}</p>

          {food.available === false && (
            <div className={styles.unavailable}>Currently unavailable</div>
          )}

          <div className={styles.actions}>
            <div className={styles.qtyBox}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className={styles.addBtn} onClick={handleAdd} disabled={food.available === false}>
              Add to Cart
            </button>
            <button className={styles.buyBtn} onClick={handleBuyNow} disabled={food.available === false}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
