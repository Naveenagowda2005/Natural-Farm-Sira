import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Globe, Sprout } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: t('Home', 'ಮುಖಪುಟ') },
    { to: '/products', label: t('Products', 'ಉತ್ಪನ್ನಗಳು') },
    { to: '/about', label: t('About Us', 'ನಮ್ಮ ಬಗ್ಗೆ') },
    { to: '/gallery', label: t('Gallery', 'ಗ್ಯಾಲರಿ') },
    { to: '/videos', label: t('Videos', 'ವೀಡಿಯೊಗಳು') },
    { to: '/success-stories', label: t('Success Stories', 'ಯಶಸ್ಸಿನ ಕಥೆಗಳು') },
    { to: '/contact', label: t('Contact', 'ಸಂಪರ್ಕ') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-glass backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto">
        <div className={`flex items-center justify-between h-16 md:h-20 px-4 md:px-8 transition-all duration-300 ${
          scrolled ? 'border-b border-white/10' : ''
        }`}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Natural Farm Sira" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain" 
              />
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl font-bold gradient-text">
                Natural Farm Sira
              </span>
              <span className="text-xs text-muted-foreground hidden md:block">
                {t('Since 2020', '2020 ರಿಂದ')}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(item.to)
                    ? 'text-primary-foreground'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {isActive(item.to) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg" />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
            
            <button
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="ml-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-farm-gold to-farm-amber text-secondary-foreground hover:shadow-lg hover:shadow-farm-gold/30 transition-all duration-300 hover:scale-105"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-farm-gold to-farm-amber text-secondary-foreground"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-white/10 bg-glass backdrop-blur-xl px-4 pb-6">
            <div className="space-y-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive(item.to)
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
