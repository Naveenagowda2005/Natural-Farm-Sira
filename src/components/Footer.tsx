import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MapPin, MessageCircle, Instagram, Facebook, Youtube, Mail, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { to: '/', label: t('Home', 'ಮುಖಪುಟ') },
    { to: '/products', label: t('Products', 'ಉತ್ಪನ್ನಗಳು') },
    { to: '/about', label: t('About Us', 'ನಮ್ಮ ಬಗ್ಗೆ') },
    { to: '/gallery', label: t('Gallery', 'ಗ್ಯಾಲರಿ') },
    { to: '/videos', label: t('Videos', 'ವೀಡಿಯೊಗಳು') },
    { to: '/success-stories', label: t('Success Stories', 'ಯಶಸ್ಸಿನ ಕಥೆಗಳು') },
    { to: '/contact', label: t('Contact', 'ಸಂಪರ್ಕ') },
  ];

  const contacts = [
    { name: 'Mahesh', phone: '+91 8660674360' },
    { name: 'Omkar', phone: '+91 79753 47847' },
    { name: 'Usha', phone: '+91 97408 05183' },
    { name: 'Mahalakshmi', phone: '+91 9964254014' },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-farm-gold/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Natural Farm Sira" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="font-heading text-xl font-bold">Natural Farm Sira</h3>
                <p className="text-xs text-white/60">{t('Since 2020', '2020 ರಿಂದ')}</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              {t(
                'Your trusted partner for quality agricultural products, machinery, and expert guidance for India\'s farmers.',
                'ಭಾರತದ ರೈತರಿಗೆ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಉತ್ಪನ್ನಗಳು, ಯಂತ್ರಗಳು ಮತ್ತು ತಜ್ಞ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಪಾಲುದಾರ.'
              )}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="https://www.facebook.com/omkar.gowda.779?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center hover:bg-[#1877F2]/80 transition-all hover:scale-110">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="https://instagram.com/natural_farm_sira?igshid=ZDc4ODBmNjlmNQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center hover:opacity-80 transition-all hover:scale-110">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="https://youtube.com/@naturalfarmsira" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#FF0000] flex items-center justify-center hover:bg-[#FF0000]/80 transition-all hover:scale-110">
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a href="https://wa.me/918660674360" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center hover:bg-[#25D366]/80 transition-all hover:scale-110">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-5">{t('Quick Links', 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು')}</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:translate-x-1 transition-all group"
                >
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-5">{t('Products', 'ಉತ್ಪನ್ನಗಳು')}</h4>
            <div className="space-y-3 text-sm opacity-80">
              <Link to="/products?category=agri-machines" className="block hover:text-white transition-colors">
                🚜 {t('Agricultural Machines', 'ಕೃಷಿ ಯಂತ್ರಗಳು')}
              </Link>
              <Link to="/products?category=livestock" className="block hover:text-white transition-colors">
                🐄 {t('Livestock Accessories', 'ಪಶು ಸಂಗೋಪನೆ ಸಲಕರಣೆ')}
              </Link>
              <Link to="/products?category=seeds" className="block hover:text-white transition-colors">
                🌱 {t('Seeds', 'ಬೀಜಗಳು')}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-5">{t('Contact Us', 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ')}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p>Sira, Tumkur,</p>
                  <p>Karnataka, India</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p>{t('Mon - Sun', 'ಸೋಮ - ಭಾನು')}</p>
                  <p>7:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="pt-2">
                {contacts.map((contact) => (
                  <a
                    key={contact.name}
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 hover:text-white transition-colors py-1"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                    <span className="text-xs opacity-60">({contact.name})</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm opacity-60">
              © {new Date().getFullYear()} Natural Farm Sira. {t('All rights reserved.', 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.')}
            </div>
            <div className="flex items-center gap-4 text-sm opacity-60">
              <span>🌾 {t('Empowering India\'s Farmers', 'ಭಾರತದ ರೈತರನ್ನು ಶಕ್ತಗೊಳಿಸುತ್ತಿದ್ದೇವೆ')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
