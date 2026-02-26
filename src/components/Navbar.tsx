import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { to: '/', label: t('Home', 'ಮುಖಪುಟ') },
    { to: '/products', label: t('Products', 'ಉತ್ಪನ್ನಗಳು') },
    { to: '/about', label: t('About Us', 'ನಮ್ಮ ಬಗ್ಗೆ') },
    { to: '/gallery', label: t('Gallery', 'ಗ್ಯಾಲರಿ') },
    { to: '/contact', label: t('Contact', 'ಸಂಪರ್ಕ') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-heading text-xl font-bold text-primary">Natural Farm Sira</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive(item.to)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            className="ml-2 flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold bg-secondary text-secondary-foreground"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === 'en' ? 'ಕನ್ನಡ' : 'EN'}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pb-4">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                isActive(item.to)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
