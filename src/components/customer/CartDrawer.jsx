import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
} from '../../store/slices/cartSlice';
import { IMAGE_BASE } from '../../utils/constants';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <span>🛒 Your Cart</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🍽️</div>
            <p>Your cart is empty</p>
            <button className={styles.browseBtn} onClick={() => { onClose(); navigate('/menu'); }}>
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.foodId} className={styles.item}>
                  <div className={styles.itemImg}>
                    {item.image
                      ? <img src={`${IMAGE_BASE}/${item.image}`} alt={item.name} />
                      : <span>🍽️</span>}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <div className={styles.qtyControls}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => dispatch(updateQuantity({ foodId: item.foodId, quantity: item.quantity - 1 }))}
                    >−</button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => dispatch(updateQuantity({ foodId: item.foodId, quantity: item.quantity + 1 }))}
                    >+</button>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => dispatch(removeFromCart(item.foodId))}
                  >🗑</button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmount}>${total.toFixed(2)}</span>
              </div>
              <button className={styles.checkoutBtn} onClick={handleCheckout}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
