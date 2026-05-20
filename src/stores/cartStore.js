import { create } from 'zustand';
import { cartService } from '../utils/services';
import { useAuthStore } from './authStore';

export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,
  
  fetchCart: async (userId) => {
    if (!userId) return;
    set({ isLoading: true });
    try {
      const cartItems = await cartService.getUserCart(userId);
      const mappedItems = cartItems.map(item => ({
        id: item.id,
        buyer_id: item.buyer_id,
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.products?.title || '',
        price: Number(item.products?.price) || 0,
        description: item.products?.description || '',
        image_url: item.products?.image_url || '',
        seller_id: item.products?.seller_id || '',
        products: item.products
      }));
      set({ cart: mappedItems, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  addToCart: async (product, quantity = 1) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      console.warn("User not logged in, cannot add to cart");
      return;
    }
    set({ isLoading: true });
    try {
      await cartService.addToCart(user.id, product.id, quantity);
      await get().fetchCart(user.id);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  removeFromCart: async (itemId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    set({ isLoading: true });
    try {
      await cartService.removeFromCart(itemId);
      await get().fetchCart(user.id);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearCart: () => set({ cart: [] }),
  
  calculateTotal: () => {
    return get().cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}));