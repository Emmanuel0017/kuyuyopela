import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Briefcase,
  MapPin, Star, Settings, LogOut, Search, Menu, Sun, Moon, X,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { cn } from '../lib/cn';
import { ToastHost } from '../components/Toast';

const NAV = [
  { to: '/dashboard', label: 'Dashboard',       Icon: LayoutDashboard },
  { to: '/products',  label: 'Products',        Icon: Package },
  { to: '/orders',    label: 'Orders',          Icon: ShoppingBag },
  { to: '/customers', label: 'Customers',       Icon: Users },
  { to: '/agents',    label: 'Agents',          Icon: Briefcase },
  { to: '/stores',    label: 'Store Locations', Icon: MapPin },
  { to: '/testimonials', label: 'Testimonials',  Icon: Star },
  { to: '/settings',  label: 'Settings',        Icon: Settings },
];

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const initials = (admin?.email ?? 'A').slice(0, 1).toUpperCase();

  return (
    <div className="flex min-h-screen">
      <ToastHost />

      {/* mobile overlay */}
      <div className={cn('sidebar-overlay', open && 'show')} onClick={() => setOpen(false)} />

      <aside className={cn('sidebar', open && 'open')}>
        <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
        <div className="logo">KY <span>|</span> ADMIN</div>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) => cn('side-link', isActive && 'active')}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="side-link mt-auto w-full text-left bg-transparent border-0"
          style={{ marginTop: 'auto' }}
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </aside>

      <div className="main-area flex-1 flex flex-col min-w-0">
        <header className="topbar">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button className="menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9"
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
          <div className="profile">
            <button
              onClick={toggle}
              className="btn btn-ghost btn-sm"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="avatar">{initials}</div>
            <div className="hidden sm:block">
              <div className="text-[13px] font-semibold leading-tight">{admin?.email}</div>
              <div className="text-[11px] text-gray-500">{admin?.role}</div>
            </div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}