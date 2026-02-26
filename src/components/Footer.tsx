import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">🌾 Natural Farm Sira</h3>
            <p className="text-sm opacity-80">
              {t(
                'Quality agricultural machines, livestock accessories, and seeds for modern Indian farmers.',
                'ಆಧುನಿಕ ಭಾರತೀಯ ರೈತರಿಗೆ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಯಂತ್ರಗಳು, ಪಶುಸಂಗೋಪನೆ ಸಲಕರಣೆಗಳು ಮತ್ತು ಬೀಜಗಳು.'
              )}
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-bold mb-3">{t('Quick Links', 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು')}</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <Link to="/products" className="hover:opacity-100 transition-opacity">{t('Products', 'ಉತ್ಪನ್ನಗಳು')}</Link>
              <Link to="/about" className="hover:opacity-100 transition-opacity">{t('About Us', 'ನಮ್ಮ ಬಗ್ಗೆ')}</Link>
              <Link to="/contact" className="hover:opacity-100 transition-opacity">{t('Contact', 'ಸಂಪರ್ಕ')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-lg font-bold mb-3">{t('Contact Us', 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ')}</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Sira, Tumkur, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:+918660674360" className="hover:opacity-100">8660674360 (Mahesh)</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:+917975347847" className="hover:opacity-100">+91 79753 47847 (Omkar)</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Natural Farm Sira. {t('All rights reserved.', 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
