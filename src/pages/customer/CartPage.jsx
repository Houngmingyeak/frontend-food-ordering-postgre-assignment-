import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCartItems, selectCartTotal,
  updateQuantity, removeFromCart, clearCart,
} from '../../store/slices/cartSlice';
import { usePlaceOrderMutation } from '../../store/slices/apiSlice';
import { IMAGE_BASE } from '../../utils/constants';
import styles from './CartPage.module.css';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  const handleOrder = async () => {
    try {
      await placeOrder({
        items: items.map((i) => ({ foodId: i.foodId, quantity: i.quantity })),
      }).unwrap();
      dispatch(clearCart());
      navigate('/orders');
    } catch (err) {
      alert(err?.data?.message || 'Failed to place order.');
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/menu" className={styles.browseBtn}>Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Cart</h1>
      <div className={styles.layout}>
        {/* Items */}
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
                <div className={styles.itemUnit}>${item.price.toFixed(2)} each</div>
              </div>
              <div className={styles.qtyControls}>
                <button onClick={() => dispatch(updateQuantity({ foodId: item.foodId, quantity: item.quantity - 1 }))}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch(updateQuantity({ foodId: item.foodId, quantity: item.quantity + 1 }))}>+</button>
              </div>
              <div className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</div>
              <button className={styles.removeBtn} onClick={() => dispatch(removeFromCart(item.foodId))}>🗑</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className={styles.summaryRow}><span>Delivery</span><span className={styles.free}>Free</span></div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span className={styles.totalAmt}>${total.toFixed(2)}</span>
            </div>
          </div>
          <button className={styles.orderBtn} onClick={handleOrder} disabled={isLoading}>
            {isLoading ? 'Placing order...' : 'Place Order →'}
          </button>
          <Link to="/menu" className={styles.continueLink}>← Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
