import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wallet,
  Calendar, Settings, PiggyBank,
  User
} from 'lucide-react';

const getNavItems = (role) => {
  if (role === 'membre') {
    return [
      { to: '/',             icon: LayoutDashboard, label: 'Accueil'   },
      { to: '/mes-finances', icon: PiggyBank,       label: 'Finances'  },
      { to: '/seances',      icon: Calendar,        label: 'Séances'   },
      { to: '/profil',       icon: User,            label: 'Profil'    },
    ];
  }

  if (['president','vice_president','secretaire'].includes(role)) {
    return [
      { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/members',   icon: Users,           label: 'Membres'   },
      { to: '/seances',   icon: Calendar,        label: 'Séances'   },
      { to: '/tontines',  icon: Wallet,          label: 'Tontines'  },
      { to: '/settings',  icon: Settings,        label: 'Params'    },
    ];
  }

  return [
    { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/seances',  icon: Calendar,        label: 'Séances'   },
    { to: '/tontines', icon: Wallet,          label: 'Tontines'  },
    { to: '/settings', icon: Settings,        label: 'Params'    },
  ];
};

export default function BottomNav({ role }) {
  const navItems = getNavItems(role);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50
      bg-[#161b27] border-t border-[#2e3a50]
      safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5
               rounded-xl transition min-w-0 ${isActive
                ? 'text-blue-400'
                : 'text-gray-500'}`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition ${
                  isActive ? 'bg-blue-900/40' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium truncate">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}