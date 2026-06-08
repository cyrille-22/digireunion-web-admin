import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wallet,
  Calendar, Settings, LogOut,
  User, PiggyBank
} from 'lucide-react';
import useAuthStore, { isAdmin, isBureau } from '../../store/authStore';

// Navigation selon le rôle
const getNavItems = (role) => {
  // Espace membre simple
  if (role === 'membre') {
    return [
      { to: '/',          icon: LayoutDashboard, label: 'Mon espace'   },
      { to: '/mes-finances', icon: PiggyBank,    label: 'Mes finances' },
      { to: '/seances',   icon: Calendar,        label: 'Séances'      },
      { to: '/profil',    icon: User,            label: 'Mon profil'   },
    ];
  }

  // Espace bureau complet
  const items = [
    { to: '/',          icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/members',   icon: Users,           label: 'Membres'     },
    { to: '/tontines',  icon: Wallet,          label: 'Tontines'    },
    { to: '/seances',   icon: Calendar,        label: 'Séances'     },
  ];

  if (isAdmin(role)) {
    items.push(
      { to: '/settings', icon: Settings, label: 'Paramètres' }
    );
  }

  return items;
};

export default function SidebarDesktop({ role }) {
  const { membre, logout } = useAuthStore();
  const navItems = getNavItems(role);

  const roleColors = {
    president:      'bg-blue-900/40 text-blue-400',
    vice_president: 'bg-teal-900/40 text-teal-400',
    secretaire:     'bg-green-900/40 text-green-400',
    tresorier:      'bg-amber-900/40 text-amber-400',
    cac:            'bg-purple-900/40 text-purple-400',
    censeur:        'bg-red-900/40 text-red-400',
    membre:         'bg-gray-800 text-gray-400',
  };

  return (
    <div className="w-52 min-h-screen bg-[#161b27]
      border-r border-[#2e3a50] flex flex-col">

      {/* Logo */}
      <div className="p-5 border-b border-[#2e3a50]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg
            flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">
              Digi-Réunion
            </h1>
            <p className="text-xs text-gray-500 font-mono">v1.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg
               mb-1 text-sm transition ${isActive
                ? 'bg-blue-900/40 text-blue-400 border border-blue-800/30'
                : 'text-gray-400 hover:bg-[#1e2535] hover:text-white'}`
            }>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profil */}
      <div className="p-3 border-t border-[#2e3a50]">
        <div className="px-3 py-2 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-blue-900/40
              text-blue-400 flex items-center justify-center
              text-xs font-bold">
              {membre?.nom?.split(' ')
                .map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <p className="text-sm font-medium text-white truncate">
              {membre?.nom}
            </p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-md
            font-mono ${roleColors[role] || roleColors.membre}`}>
            {role}
          </span>
        </div>
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg
            text-sm text-gray-400 hover:text-red-400
            hover:bg-red-900/20 w-full transition">
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}