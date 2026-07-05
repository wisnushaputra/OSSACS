import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    username: string;
    fullname: string;
    roleId: string;
  } | null;
  login: (accessToken: string, refreshToken: string, user: AuthState['user']) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  login: (accessToken, refreshToken, user) => set({ isAuthenticated: true, accessToken, refreshToken, user }),
  logout: () => set({ isAuthenticated: false, accessToken: null, refreshToken: null, user: null }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
}));
