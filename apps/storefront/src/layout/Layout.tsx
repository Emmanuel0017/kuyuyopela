import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Preloader } from '../components/Preloader';
import { ScrollProgress } from '../components/ScrollProgress';
import { Aurora } from '../components/Aurora';
import { CartDrawer } from '../components/CartDrawer';
import { WhatsAppFloat } from '../components/WhatsAppFloat';
import { Footer } from '../components/Footer';
import { cn } from '../lib/cn';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/results', label: 'Results' },
  { to: '/agents', label: 'Become an Agent' },
  { to: '/stores', label: 'Store Locator' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export function Layout() {
  const location = useLocation();
  const itemCount = useCartStore((s) => s.itemCount());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div>
      <Preloader />
      <ScrollProgress />
      <Aurora />

      <header className={cn('glass-header', scrolled && 'scrolled')}>
        <div className="max-w-300 mx-auto px-5 relative">
          {/* TOP BAR */}
          <nav className="flex items-center justify-between py-3.5">
            <Link to="/" className="font-bold text-xl text-tide-dark no-underline shrink-0">
              KY <span className="text-gold">|</span> KUYUYOPELA
            </Link>

            {/* DESKTOP NAV (centered, inline) */}
            <ul className="hidden md:flex gap-7 items-center list-none p-0 m-0 absolute left-1/2 -translate-x-1/2">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    end={n.to === '/'}
                    className={({ isActive }) =>
                      cn('nav-link text-inherit no-underline', isActive && 'active')
                    }
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={openDrawer}
                className="relative bg-transparent border-0 text-xl cursor-pointer p-2"
                aria-label="Open cart"
              >
                🛒
                {itemCount > 0 && (
                  <span className="cart-count absolute -top-1 -right-1 bg-tide text-white text-[11px] px-1.5 py-0.5 rounded-[10px] min-w-[18px] text-center">
                    {itemCount}
                  </span>
                )}
              </button>
              {/* MOBILE HAMBURGER (hidden on md+) */}
              <button
                className="md:hidden text-2xl bg-transparent border-0 cursor-pointer p-2"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </nav>

          {/* MOBILE NAV PANEL (slides down) */}
          <ul
            className={cn(
              'md:hidden list-none p-0 m-0',
              'flex flex-col bg-white shadow-xl rounded-b-2xl overflow-hidden',
              'transition-[max-height,opacity] duration-300 ease-out',
              menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
            )}
          >
            {NAV.map((n) => (
              <li key={n.to} className="border-b border-neutral-100 last:border-b-0">
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block px-5 py-3.5 text-inherit no-underline',
                      'border-l-4 border-transparent transition-colors',
                      'hover:bg-tide/5 hover:border-tide',
                      isActive && 'bg-tide/5 border-tide text-tide font-bold',
                    )
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main key={location.pathname} className="page-enter">
        <Outlet />
      </main>

      <CartDrawer />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}