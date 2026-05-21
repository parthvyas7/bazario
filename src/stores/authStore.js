import { create } from 'zustand';
import { authService } from '../utils/services';

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
  error: null,
  
  initialize: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        // Fetch profile data if needed
        const profile = await authService.getProfile(user.seller_id || user.id);
        set({ user, profile, isLoading: false, isInitialized: true });
      } else {
        set({ user: null, profile: null, isLoading: false, isInitialized: true });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ error: error.message, isLoading: false, isInitialized: true, user: null, profile: null });
    }
  },
  
  signIn: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.signIn(email, password, role);
      if (user) {
        const userData = await authService.getCurrentUser();
        if (!userData) {
          throw new Error('Your account profile could not be found. Please try registering again.');
        }
        const profile = await authService.getProfile(user.id);
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