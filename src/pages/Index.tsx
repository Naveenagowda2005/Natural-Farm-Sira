import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/products';
import BannerCarousel from '@/components/BannerCarousel';
import { ArrowRight, Shield, Phone, Sparkles, Truck } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  const categoryIcons: Record<string, string> = {
    'agri-machines': '🚜',
    'livestock': '🐄',
    'seeds': '🌾',
  };

  return (
    <main>
      {/* Hero Section with Dynamic Banner Carousel */}
      <section className="relative">
        <BannerCarousel />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 animate-float opacity-20">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute top-40 right-20 animate-float-delayed opacity-20">
              <Sparkles className="w-16 h-16 text-secondary" />
            </div>
            <div className="absolute bottom-40 left-1/4 animate-float opacity-15">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="text-center px-4 max-w-4xl mx-auto">
            <div className="animate-fade-in-down mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold border border-white/20">
                🌾 {t('Trusted by Farmers Across India', 'ಭಾರತದಾದ್ಯಂತ ರೈತರಿಂದ ನಂಬಲ್ಪಟ್ಟ')}
              </span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Natural Farm Sira
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in-up stagger-1">
              {t(
                'Quality agricultural machines, livestock accessories & Napier Sticks for India\'s farmers',
                'ಭಾರತದ ರೈತರಿಗಾಗಿ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಯಂತ್ರಗಳು, ಪಶುಸಂಗೋಪನೆ ಸಲಕರಣೆಗಳು ಮತ್ತು ನೇಪಿಯರ್ ಕಡ್ಡಿಗಳು'
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
              <Link
                to="/products"
                className="btn-premium inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg"
              >
                {t('Browse Products', 'ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 transition-all font-bold"
              >
                {t('Contact Us', 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-gradient py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 animate-fade-in">
              {t('Our Categories', 'ನಮ್ಮ ವಿಭಾಗಗಳು')}
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
              {t('Everything You Need', 'ನಿಮಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up stagger-1">
              {t('From farm machinery to Napier Sticks, we provide complete agricultural solutions', 'ಕೃಷಿ ಯಂತ್ರಗಳಿಂದ ನೇಪಿಯರ್ ಕಡ್ಡಿಗಳವರೆಗೆ, ನಾವು ಸಂಪೂರ್ಣ ಕೃಷಿ ಪರಿಹಾರಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group glass-card rounded-2xl p-8 text-center hover-lift-glow"
              >
                <div className="relative inline-block mb-6">
                  <span className="text-6xl block transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {categoryIcons[cat.id]}
                  </span>
                  <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {t(cat.nameEn, cat.nameKn)}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {t('Explore products →', 'ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ →')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-accent py-20 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              {t('Why Choose Us', 'ಏಕೆ ನಮ್ಮನ್ನು ಆರಿಸಬೇಕು')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto stagger-children">
            {[
              { 
                icon: Shield, 
                titleEn: 'Quality Assured', 
                titleKn: 'ಗುಣಮಟ್ಟ ಖಾತರಿ', 
                descEn: 'All products are quality tested', 
                descKn: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಿತ'
              },
              { 
                icon: Phone, 
                titleEn: 'Expert Support', 
                titleKn: 'ತಜ್ಞ ಬೆಂಬಲ', 
                descEn: 'Available Mon-Sun, 7AM-10PM', 
                descKn: 'ಸೋಮ-ಭಾನು, ಬೆ. 7-ರಾ. 10'
              },
              { 
                icon: Truck, 
                titleEn: 'Delivery Available', 
                titleKn: 'ವಿತರಣೆ ಲಭ್ಯ', 
                descEn: 'We deliver across India', 
                descKn: 'ಭಾರತದಾದ್ಯಂತ ವಿತರಣೆ'
              },
            ].map((item) => (
              <div 
                key={item.titleEn} 
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all group-hover:scale-110 group-hover:rotate-3">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  {t(item.titleEn, item.titleKn)}
                </h3>
                <p className="text-white/80">{t(item.descEn, item.descKn)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-gradient py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto stagger-children">
            {[
              { number: '6+', label: { en: 'Years Experience', kn: 'ವರ್ಷಗಳ ಅನುಭವ' } },
              { number: '50K+', label: { en: 'Happy Customers', kn: 'ತೃಪ್ತ ಗ್ರಾಹಕರು' } },
              { number: '100+', label: { en: 'Products', kn: 'ಉತ್ಪನ್ನಗಳು' } },
              { number: '24/7', label: { en: 'Support', kn: 'ಬೆಂಬಲ' } },
            ].map((stat) => (
              <div key={stat.number} className="glass-card rounded-2xl p-6 text-center hover-lift-glow">
                <div className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {t(stat.label.en, stat.label.kn)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden hover-lift-glow">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
                {t('Ready to Transform Your Farm?', 'ನಿಮ್ಮ ಕೃಷಿಯನ್ನು ಪರಿವರ್ತಿಸಲು ಸಿದ್ಧರಾ?')}
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto animate-fade-in-up stagger-1">
                {t('Contact us today for personalized recommendations and exclusive offers', 'ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳು ಮತ್ತು ವಿಶೇಷ ಆಫರ್‌ಗಳಿಗಾಗಿ ಇಂದೇ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
                <Link
                  to="/products"
                  className="btn-premium inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg"
                >
                  {t('View All Products', 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg bg-secondary text-secondary-foreground font-bold hover:opacity-90 transition-all"
                >
                  {t('Get in Touch', 'ಸಂಪರ್ಕಿಸಿ')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
