import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/products';
import heroBanner from '@/assets/hero-banner.png';
import { ArrowRight, Truck, Shield, Phone } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  const categoryIcons: Record<string, string> = {
    'agri-machines': '🚜',
    'livestock': '🐄',
    'seeds': '🌱',
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={heroBanner}
          alt="Natural Farm Sira - Agricultural fields"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-card mb-4">
            Natural Farm Sira
          </h1>
          <p className="text-lg md:text-xl text-card/90 max-w-xl mx-auto mb-6">
            {t(
              'Quality agricultural machines, livestock accessories & seeds for Karnataka\'s farmers',
              'ಕರ್ನಾಟಕದ ರೈತರಿಗಾಗಿ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಯಂತ್ರಗಳು, ಪಶುಸಂಗೋಪನೆ ಸಲಕರಣೆಗಳು ಮತ್ತು ಬೀಜಗಳು'
            )}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            {t('Browse Products', 'ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-heading text-3xl font-bold text-center mb-10">
          {t('Our Categories', 'ನಮ್ಮ ವಿಭಾಗಗಳು')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="group bg-card rounded-xl border border-border p-8 text-center hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <span className="text-5xl block mb-4">{categoryIcons[cat.id]}</span>
              <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {t(cat.nameEn, cat.nameKn)}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-farm-green-light py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, titleEn: 'Delivery Available', titleKn: 'ವಿತರಣೆ ಲಭ್ಯ', descEn: 'We deliver across Karnataka', descKn: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ವಿತರಣೆ' },
              { icon: Shield, titleEn: 'Quality Assured', titleKn: 'ಗುಣಮಟ್ಟ ಖಾತರಿ', descEn: 'All products are quality tested', descKn: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಿತ' },
              { icon: Phone, titleEn: 'Call for Support', titleKn: 'ಸಹಾಯಕ್ಕಾಗಿ ಕರೆ ಮಾಡಿ', descEn: 'Available Mon-Sat, 9AM-7PM', descKn: 'ಸೋಮ-ಶನಿ, ಬೆ. 9-ಸಂ. 7' },
            ].map(item => (
              <div key={item.titleEn} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t(item.titleEn, item.titleKn)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t(item.descEn, item.descKn)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
