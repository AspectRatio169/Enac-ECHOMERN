import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Leaf,
  AlertTriangle,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { useSiteContent } from '../lib/SiteContentContext';

// ── Announcement Banner ────────────────────────────────────────────────────────
const BANNER_STYLES = {
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: Info,
    iconCl: "text-blue-500",
  },
  success: {
    bg: "bg-eco-50 border-eco-200",
    text: "text-moss",
    icon: CheckCircle,
    iconCl: "text-leaf",
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    icon: AlertTriangle,
    iconCl: "text-amber-500",
  },
};

// Stateless banner body — dismiss is controlled by parent
function BannerBody({ banner, onDismiss }) {
  if (!banner?.enabled) return null;
  const style = BANNER_STYLES[banner.type] ?? BANNER_STYLES.info;
  const Icon = style.icon;
  return (
    <div className={`w-full border-b px-4 py-2.5 flex items-center justify-between gap-3 ${style.bg}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className={`w-4 h-4 shrink-0 ${style.iconCl}`} />
        <p className={`font-body text-sm font-medium truncate ${style.text}`}>
          {banner.message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className={`shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors ${style.text}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Single dismissed state shared across both desktop and mobile banner instances
  const [dismissed, setDismissed] = useState(false);
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { homepage } = useSiteContent();
  const { banner } = homepage;

  const showBanner = banner?.enabled && !dismissed;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-scrolled' : 'bg-transparent'}`}>
      {/* ── Main navbar row ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-moss rounded-xl flex items-center justify-center group-hover:bg-leaf transition-colors duration-300 shadow-sm">
              <Leaf className="w-5 h-5 text-cream" strokeWidth={2} />
            </div>
            <div>
              <span className="font-display font-bold text-moss text-lg tracking-tight">ECHO</span>
              <span className="hidden sm:block font-body text-xs text-leaf -mt-1">by Enactus NSUT</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`nav-link font-display font-medium text-sm tracking-wide transition-colors duration-200 ${isActive('/') ? 'text-moss active' : 'text-bark/70 hover:text-moss'}`}>Home</Link>
            <Link to="/about" className={`nav-link font-display font-medium text-sm tracking-wide transition-colors duration-200 ${isActive('/about') ? 'text-moss active' : 'text-bark/70 hover:text-moss'}`}>About</Link>
            {user && (
              <>
                <Link to="/dashboard" className={`nav-link font-display font-medium text-sm tracking-wide transition-colors duration-200 ${isActive('/dashboard') ? 'text-moss active' : 'text-bark/70 hover:text-moss'}`}>Dashboard</Link>
                <Link to="/groups" className={`nav-link font-display font-medium text-sm tracking-wide transition-colors duration-200 ${isActive('/groups') ? 'text-moss active' : 'text-bark/70 hover:text-moss'}`}>Groups</Link>
                {(profile?.role === 'admin' || profile?.role === 'superadmin') && (
                  <Link to="/admin" className={`nav-link font-display font-medium text-sm tracking-wide transition-colors duration-200 ${isActive('/admin') ? 'text-moss active' : 'text-bark/70 hover:text-moss'}`}>Admin</Link>
                )}
              </>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-body text-sm text-bark/60">Hi, {profile?.name?.split(' ')[0] || user.name?.split(' ')[0] || 'Eco Hero'}</span>
                <button onClick={handleLogout} className="font-display font-semibold text-sm text-moss border-2 border-moss px-5 py-2 rounded-full hover:bg-moss hover:text-cream transition-all duration-300">
                  Log Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2.5 px-6">Login</Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-moss hover:bg-eco-100 transition-colors duration-200">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Announcement Banner — full width, below navbar bar on all screen sizes ── */}
      {showBanner && (
        <BannerBody banner={banner} onDismiss={() => setDismissed(true)} />
      )}

      {/* ── Mobile menu — banner at top, then links ── */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-cream/95 backdrop-blur-md border-t border-eco-100 px-6 py-4 space-y-1">
          <Link to="/" className="block font-display font-medium text-moss py-3 border-b border-eco-100">Home</Link>
          <Link to="/about" className="block font-display font-medium text-bark/70 py-3 border-b border-eco-100 hover:text-moss">About</Link>
          {user && (
            <>
              <Link to="/dashboard" className="block font-display font-medium text-bark/70 py-3 border-b border-eco-100 hover:text-moss">Dashboard</Link>
              <Link to="/groups" className="block font-display font-medium text-bark/70 py-3 border-b border-eco-100 hover:text-moss">Groups</Link>
              {(profile?.role === 'admin' || profile?.role === 'superadmin') && (
                <Link to="/admin" className="block font-display font-medium text-bark/70 py-3 border-b border-eco-100 hover:text-moss">Admin</Link>
              )}
            </>
          )}
          <div className="pt-3">
            {user ? (
              <button onClick={handleLogout} className="btn-secondary w-full justify-center text-sm">Log Out</button>
            ) : (
              <Link to="/login" className="btn-primary w-full justify-center text-sm inline-flex">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}