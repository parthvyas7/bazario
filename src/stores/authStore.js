import { create } from 'zustand';
import { authService } from '../utils/services';

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  error: null,
  
  initialize: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        // Fetch profile data if needed
        const { data: profile } = await authService.getProfile(user.id);
        set({ user, profile, isLoading: false });
      } else {
        set({ user: null, profile: null, isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ error: error.message, isLoading: false, user: null, profile: null });
    }
  },
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.signIn(email, password);
      if (user) {
        const userData = await authService.getCurrentUser();
        const { data: profile } = await authService.getProfile(user.id);
        set({ user: userData, profile, isLoading: false });
        return { user: userData, profile };
      }
      throw new Error('Failed to sign in');
    } catch (error) {
      const errorMessage = error.message || 'Failed to sign in';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  signUp: async (email, password, role, additionalData) => {
    set({ isLoading: true, error: null });
    try {
      await authService.signUp(email, password, role, additionalData);
      set({ isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Failed to sign up';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({ user: null, profile: null, isLoading: false });
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  clearError: () => set({ error: null }),
  
  updateUserProfile: (updates) => {
    set((state) => ({
      user: { ...state.user, ...updates },
      profile: { ...state.profile, ...updates }
    }));
  }
}));