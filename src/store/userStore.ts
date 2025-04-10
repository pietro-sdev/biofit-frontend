import { create } from 'zustand';

type UserRole = 'ADMIN' | 'ESTOQUISTA' | 'CLIENTE';

interface UserState {
  email: string;
  role: UserRole | null;
  setUser: (email: string, role: UserRole) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  email: '',
  role: null,
  setUser: (email, role) => set({ email, role }),
  clearUser: () => set({ email: '', role: null }),
}));
