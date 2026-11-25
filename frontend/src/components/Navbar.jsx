import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, LogOut, Calendar, LayoutDashboard, Globe, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';

const BrandCrest = () => (
  <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none" aria-hidden="true">
    <rect width="36" height="36" rx="10" fill="#1b1e22" stroke="#b88238" strokeWidth="1.5" />
    <path d="M12 10L24 26M24 10L12 26" stroke="#dbb67a" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="26" r="2.2" stroke="#dbb67a" strokeWidth="1.5" />
    <circle cx="24" cy="26" r="2.2" stroke="#dbb67a" strokeWidth="1.5" />
    <path d="M18 7V11" stroke="#b88238" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languages = [
    { code: 'am', name: 'አማርኛ', short: 'AM' },
    { code: 'om', name: 'Afaan Oromo', short: 'OM' },
    { code: 'ti', name: 'ትግርኛ', short: 'TI' },
    { code: 'en', name: 'English', short: 'EN' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[3];

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'text-primary-300'
        : 'text-gray-300 hover:text-white'
    }`;

  return (
    <nav className="bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-700/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <BrandCrest />
            <div className="leading-tight">
              <span className="block text-lg font-serif font-bold tracking-tight text-white group-hover:text-primary-300 transition-colors">
                Addis Crown
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-primary-300/90 font-semibold">
                Barbershop
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClass('/')}>
              {t('nav.home')}
            </Link>
            <Link to="/services" className={navLinkClass('/services')}>
              {t('nav.services')}
            </Link>
            <Link to="/barbers" className={navLinkClass('/barbers')}>
              {t('nav.barbers')}
            </Link>
            <Link to="/booking" className="btn-primary text-sm py-2 px-4">
              {t('nav.booking')}
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-charcoal-700 bg-charcoal-800 text-gray-200 hover:border-primary-500/60 text-xs font-semibold transition-colors"
                type="button"
              >
                <Globe size={15} className="text-primary-400" />
                <span>{currentLanguage.short}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-charcoal-800 border border-charcoal-700 rounded-xl shadow-xl py-1.5 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-charcoal-700 flex items-center justify-between transition-colors ${
                        i18n.language === lang.code
                          ? 'text-primary-300 font-semibold'
                          : 'text-gray-200'
                      }`}
                      type="button"
                    >
                      <span>{lang.name}</span>
                      <span className="text-[11px] uppercase text-gray-400">{lang.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {(user?.role === 'admin' || user?.role === 'staff') && (
                  <Link to="/admin" className="text-gray-300 hover:text-primary-300 transition-colors" title="Admin">
                    <LayoutDashboard size={19} />
                  </Link>
                )}
                <Link to="/appointments" className="text-gray-300 hover:text-primary-300 transition-colors" title="Appointments">
                  <Calendar size={19} />
                </Link>
                <Link to="/profile" className="text-gray-300 hover:text-primary-300 transition-colors" title="Profile">
                  <User size={19} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                  type="button"
                  title="Logout"
                >
                  <LogOut size={19} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-charcoal-700 text-gray-200 hover:border-primary-400 hover:text-white text-sm font-medium transition-colors"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-200 p-2 rounded-lg hover:bg-charcoal-800"
            type="button"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-charcoal-700/80 space-y-3">
            <Link to="/" className="block py-1.5 text-gray-200 hover:text-primary-300" onClick={() => setIsMenuOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link to="/services" className="block py-1.5 text-gray-200 hover:text-primary-300" onClick={() => setIsMenuOpen(false)}>
              {t('nav.services')}
            </Link>
            <Link to="/barbers" className="block py-1.5 text-gray-200 hover:text-primary-300" onClick={() => setIsMenuOpen(false)}>
              {t('nav.barbers')}
            </Link>
            <Link to="/booking" className="btn-primary w-full text-sm" onClick={() => setIsMenuOpen(false)}>
              {t('nav.booking')}
            </Link>
            <div className="pt-2 flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                    i18n.language === lang.code
                      ? 'border-primary-400 bg-primary-500/20 text-primary-200'
                      : 'border-charcoal-700 text-gray-300'
                  }`}
                  type="button"
                >
                  {lang.name}
                </button>
              ))}
            </div>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block text-center py-2 rounded-xl border border-charcoal-700 text-gray-200 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
