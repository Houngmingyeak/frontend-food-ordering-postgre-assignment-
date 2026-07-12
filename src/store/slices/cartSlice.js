import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],        // { foodId, name, price, image, quantity }
  totalQuantity: 0,
  totalPrice: 0,
};

const recalculate = (state) => {
  state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
  state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.foodId === item.foodId);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      recalculate(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.foodId !== action.payload);
      recalculate(state);
    },
    updateQuantity: (state, action) => {
      const { foodId, quantity } = action.payload;
      const item = state.items.find((i) => i.foodId === foodId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.foodId !== foodId);
        } else {
          item.quantity = quantity;
        }
      }
      recalculate(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalPrice;
export const selectCartCount = (state) => state.cart.totalQuantity;
