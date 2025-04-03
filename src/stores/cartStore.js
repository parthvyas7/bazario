import { create } from 'zustand';
import { cartService } from '../utils/services';

export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  
  fetchCart: async (userId) => {
    if (!userId) return;
    set({ isLoading: true });
    try {
      const cartItems = await cartService.getUserCart(userId);
      set({ items: cartItems, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  addItem: async (userId, productId, quantity) => {
    set({ isLoading: true });
    try {
      await cartService.addToCart(userId, productId, quantity);
      await get().fetchCart(userId);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  removeItem: async (userId, itemId) => {
    set({ isLoading: true });
    try {
      await cartService.removeFromCart(itemId);
      await get().fetchCart(userId);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearCart: () => set({ items: [] }),
  
  calculateTotal: () => {
    return get().items.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  }
}));