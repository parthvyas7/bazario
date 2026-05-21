import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [], // Array of product objects
      
      addToWishlist: (product) => {
        set((state) => {
          if (state.wishlist.some((p) => p.id === product.id)) return state;
          return { wishlist: [...state.wishlist, product] };
        });
      },
      
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((p) => p.id !== productId),
        }));
      },
      
      toggleWishlist: (product) => {
        const { wishlist } = get();
        if (wishlist.some((p) => p.id === product.id)) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },
      
      isInWishlist: (productId) => {
        return get().wishlist.some((p) => p.id === productId);
      },
      
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'bazario-wishlist', // localStorage key
    }
  )
);
