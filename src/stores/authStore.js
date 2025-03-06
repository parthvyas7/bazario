import { create } from 'zustand';
import { authService } from '../services/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  initialize: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.signIn(email, password);
      const userData = await authService.getCurrentUser();
      set({ user: userData, isLoading: false });
      return userData;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  signUp: async (email, password, role, additionalData) => {
    set({ isLoading: true, error: null });
    try {
      await authService.signUp(email, password, role, additionalData);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null }),
  
  updateUserProfile: (updates) => {
    set((state) => ({
      user: { ...state.user, ...updates }
    }));
  }
}));