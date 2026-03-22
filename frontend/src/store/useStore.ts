import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  role: string;
  centrocoins_balance: number;
}

export interface Building {
  id: number;
  address: string;
  status: 'ABANDONED' | 'COMMERCIAL_ONLY' | 'MIXED_USE_POTENTIAL' | 'RETROFITTED';
  taxDebt: number;
  footTrafficScore: number;
  latitude: number;
  longitude: number;
}

interface StoreState {
  token: string | null;
  user: User | null;
  selectedBuilding: Building | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setSelectedBuilding: (building: Building | null) => void;
  logout: () => void;
}

export const useStore = create<StoreState>((set) => ({
  token: localStorage.getItem('ficaqui_token'),
  user: null,
  selectedBuilding: null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('ficaqui_token', token);
    } else {
      localStorage.removeItem('ficaqui_token');
    }
    set({ token });
  },
  setUser: (user) => set({ user }),
  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
  logout: () => {
    localStorage.removeItem('ficaqui_token');
    set({ token: null, user: null, selectedBuilding: null });
    window.location.href = '/login';
  },
}));
