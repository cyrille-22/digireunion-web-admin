import { Menu, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Topbar({ role, onMenuOpen }) {
  const { membre, logout } = useAuthStore();

  return (
    <div className="bg-[#161b27] border-b border-[#2e3a50]
      px-4 py-3 flex items-center justify-between sticky
      top-0 z-40">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg
          flex items-center justify-center">
          <span className="text-white font-bold text-sm">D</span>
        </div>
        <span className="text-white font-bold text-sm">
          Digi-Réunion
        </span>
      </div>

      {/* Profil + Déconnexion */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-white text-xs font-medium">
            {membre?.nom?.split(' ')[0]}
          </p>
          <p className="text-gray-500 text-xs capitalize">{role}</p>
        </div>
        <button onClick={logout}
          className="text-gray-400 hover:text-red-400 transition p-1">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}