import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen section-gradient flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Animated 404 */}
          <div className="relative inline-block mb-8">
            <h1 className="font-heading text-[150px] md:text-[200px] font-bold gradient-text leading-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-primary/10 rounded-full animate-pulse" />
          </div>
          
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            {t('Page Not Found', 'ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ')}
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto animate-fade-in-up stagger-1">
            {t(
              'Oops! The page you\'re looking for doesn\'t exist or has been moved.',
              'ಓಹ್! ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟವು ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ ಅಥವಾ ಸ್ಥಳಾಂತರಗೊಂಡಿದೆ.'
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
            <Link
              to="/"
              className="btn-premium inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg"
            >
              <Home className="w-5 h-5" />
              {t('Go Home', 'ಮುಖಕ್ಕೆ ಹೋಗಿ')}
            </Link>
            <Link
              to="/contact"
              className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('Contact Us', 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
