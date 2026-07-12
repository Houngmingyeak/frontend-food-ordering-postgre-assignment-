// import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { addToCart } from '../../store/slices/cartSlice';
// import { IMAGE_BASE } from '../../utils/constants';
// import { useToast } from '../../hooks/useToast';
// import styles from './FoodCard.module.css';

// export default function FoodCard({ food }) {
//   const dispatch = useDispatch();
//   const { showToast } = useToast();

//   const handleAdd = (e) => {
//     e.preventDefault();
//     dispatch(addToCart({
//       foodId: food.id,
//       name: food.name,
//       price: food.price,
//       image: food.imageName,
//     }));
//     showToast(`${food.name} added to cart!`);
//   };

//   return (
//     <Link to={`/food/${food.id}`} className={styles.card}>
//       <div className={styles.imgWrap}>
//         {food.imageName ? (
//           <img
//             src={`${IMAGE_BASE}/${food.imageName}`}
//             alt={food.name}
//             className={styles.img}
//           />
//         ) : (
//           <span className={styles.placeholder}>🍽️</span>
//         )}
//         {food.featured && <span className={styles.badge}>⭐ Featured</span>}
//         {food.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>}
//       </div>

//       <div className={styles.body}>
//         <div className={styles.category}>{food.categoryName}</div>
//         <div className={styles.name}>{food.name}</div>
//         <div className={styles.desc}>{food.description}</div>
//         <div className={styles.footer}>
//           <span className={styles.price}>${food.price?.toFixed(2)}</span>
//           <button className={styles.addBtn} onClick={handleAdd}>
//             + Add
//           </button>
//         </div>
//       </div>
//     </Link>
//   );
// }
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import { IMAGE_BASE } from '../../utils/constants';
import { useToast } from '../../hooks/useToast';
import styles from './FoodCard.module.css';

export default function FoodCard({ food }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      foodId: food.id,
      name: food.name,
      price: food.price,
      image: food.imageName,
    }));
    showToast(`${food.name} added to cart!`);
  };

  const imgSrc = food.imageUrl || (food.imageName ? `${IMAGE_BASE}/${food.imageName}` : null);

  return (
    <Link to={`/food/${food.id}`} className={styles.card}>
      <div className={styles.imgWrap}>
        {imgSrc ? (
          <img src={imgSrc} alt={food.name} className={styles.img} />
        ) : (
          <span className={styles.placeholder}>🍽️</span>
        )}
        {food.featured && <span className={styles.badge}>⭐ Featured</span>}
        {food.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.category}>{food.categoryName}</div>
        <div className={styles.name}>{food.name}</div>
        <div className={styles.desc}>{food.description}</div>
        <div className={styles.footer}>
          <span className={styles.price}>${food.price?.toFixed(2)}</span>
          <button className={styles.addBtn} onClick={handleAdd}>+ Add</button>
        </div>
      </div>
    </Link>
  );
}