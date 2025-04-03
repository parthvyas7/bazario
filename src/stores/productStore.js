import { create } from 'zustand';
import { productService } from '../utils/services';

export const useProductStore = create((set) => ({
  products: [],
  sellerProducts: [],
  currentProduct: null,
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    searchQuery: ''
  },
  isLoading: false,
  error: null,
  
  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productService.getAllProducts({
        ...get().filters,
        ...filters
      });
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchSellerProducts: async (sellerId) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productService.getSellerProducts(sellerId);
      set({ sellerProducts: products, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  getProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getProductById(productId);
      set({ currentProduct: product, isLoading: false });
      return product;
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const newProduct = await productService.createProduct(productData);
      set((state) => ({
        sellerProducts: [...state.sellerProducts, newProduct],
        isLoading: false
      }));
      return newProduct;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  updateProduct: async (productId, productData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProduct = await productService.updateProduct(productId, productData);
      set((state) => ({
        sellerProducts: state.sellerProducts.map(p => 
          p.id === productId ? updatedProduct : p
        ),
        isLoading: false
      }));
      return updatedProduct;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  deleteProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      await productService.deleteProduct(productId);
      set((state) => ({
        sellerProducts: state.sellerProducts.filter(p => p.id !== productId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },
  
  resetFilters: () => {
    set({
      filters: {
        category: null,
        minPrice: null,
        maxPrice: null,
        searchQuery: ''
      }
    });
  }
});