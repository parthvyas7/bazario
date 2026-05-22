import { create } from 'zustand';
import { cartService } from '../utils/services';
import { useAuthStore } from './authStore';

export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,
  
  fetchCart: async (userId) => {
    if (!userId) {
      try {
        const guestCart = JSON.parse(localStorage.getItem('bazario_guest_cart')) || [];
        set({ cart: guestCart, isLoading: false });
      } catch (err) {
        console.error("Failed to load guest cart:", err);
        set({ cart: [], isLoading: false });
      }
      return;
    }
    set({ isLoading: true });
    try {
      // Merge guest cart items if any exist
      const guestCartStr = localStorage.getItem('bazario_guest_cart');
      if (guestCartStr) {
        try {
          const guestCart = JSON.parse(guestCartStr) || [];
          if (guestCart.length > 0) {
            for (const item of guestCart) {
              await cartService.addToCart(userId, item.product_id, item.quantity);
            }
            localStorage.removeItem('bazario_guest_cart');
          }
        } catch (mergeErr) {
          console.error("Failed to merge guest cart items:", mergeErr);
        }
      }

      const cartItems = await cartService.getUserCart(userId);
      const mappedItems = cartItems.map(item => ({
        id: item.id,
        buyer_id: item.buyer_id,
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.products?.title || item.products?.name || '',
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
      const currentCart = [...get().cart];
      const existingItemIndex = currentCart.findIndex(item => item.product_id === product.id);
      
      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        currentCart.push({
          id: `guest_${product.id}_${Date.now()}`,
          buyer_id: null,
          product_id: product.id,
          quantity: quantity,
          name: product.title || product.name || '',
          price: Number(product.price) || 0,
          description: product.description || '',
          image_url: product.image_url || '',
          seller_id: product.seller_id || '',
          products: product
        });
      }
      
      localStorage.setItem('bazario_guest_cart', JSON.stringify(currentCart));
      set({ cart: currentCart });
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
    if (!user) {
      const currentCart = get().cart.filter(item => item.id !== itemId);
      localStorage.setItem('bazario_guest_cart', JSON.stringify(currentCart));
      set({ cart: currentCart });
      return;
    }
    set({ isLoading: true });
    try {
      await cartService.removeFromCart(itemId);
      await get().fetchCart(user.id);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearCart: () => {
    localStorage.removeItem('bazario_guest_cart');
    set({ cart: [] });
  },
  
  calculateTotal: () => {
    return get().cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}));