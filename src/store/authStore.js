import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token:  localStorage.getItem('token')  || null,
  membre: JSON.parse(localStorage.getItem('membre') || 'null'),

  login: (token, membre) => {
    localStorage.setItem('token',  token);
    localStorage.setItem('membre', JSON.stringify(membre));
    set({ token, membre });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('membre');
    set({ token: null, membre: null });
  }
}));

// ── HELPERS RÔLES ─────────────────────────────────────────────
export const isBureau = (role) =>
  ['president', 'vice_president', 'secretaire',
   'tresorier', 'cac', 'censeur'].includes(role);

export const isAdmin = (role) =>
  ['president', 'vice_president', 'secretaire'].includes(role);

export const isMembre = (role) =>
  role === 'membre';

export default useAuthStore;