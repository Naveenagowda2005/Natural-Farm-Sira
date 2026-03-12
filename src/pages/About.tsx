import { useLanguage } from '@/contexts/LanguageContext';
import { User, MapPin, Phone, Mail, Clock, Award, Heart, Star } from 'lucide-react';

const team = [
  { name: 'Mahesh', designation: { en: 'Founder & Manager', kn: 'ಸಂಸ್ಥಾಪಕ ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ' }, phone: '+91 8660674360', image: '/Mahesh.jpeg' },
  { name: 'Omkar', designation: { en: 'Operations Head', kn: 'ಕಾರ್ಯಾಚರಣೆ ಮುಖ್ಯಸ್ಥ' }, phone: '+91 79753 47847', image: '/Omkar.jpeg' },
  { name: 'Usha', designation: { en: 'Sales & Support', kn: 'ಮಾರಾಟ ಮತ್ತು ಬೆಂಬಲ' }, phone: '+91 97408 05183', image: '/Usha.jpeg' },
  { name: 'Mahalakshmi', designation: { en: 'Sales & Support', kn: 'ಮಾರಾಟ ಮತ್ತು ಬೆಂಬಲ' }, phone: '+91 9964254014', image: '/mahalakshmi.jpeg' },
  { name: 'Naveena N G', designation: { en: 'Technical Head', kn: 'ತಾಂತ್ರಿಕ ಮುಖ್ಯಸ್ಥ' }, phone: null, image: '/Naveena.jpeg' },
];

const stats = [
  { number: '6+', label: { en: 'Years Experience', kn: 'ವರ್ಷಗಳ ಅನುಭವ' }, icon: Clock },
  { number: '50K+', label: { en: 'Happy Customers', kn: 'ತೃಪ್ತ ಗ್ರಾಹಕರು' }, icon: Heart },
  { number: '100+', label: { en: 'Products', kn: 'ಉತ್ಪನ್ನಗಳು' }, icon: Award },
  { number: '5', label: { en: 'Star Rating', kn: 'ನಕ್ಷೆ ರೇಟಿಂಗ್' }, icon: Star },
];

const About = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen section-gradient">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-farm-gold/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in">
              {t('About Us', 'ನಮ್ಮ ಬಗ್ಗೆ')}
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
              <span className="gradient-text">Natural Farm Sira</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed animate-fade-in-up stagger-1">
              {t(
                'We are a trusted agricultural supply business based in Shivanayyanapalya, Sira, Tumkur, India. Since 2020, we have been providing quality Napier Sticks, farm machines, livestock accessories, and premium seeds to farmers across the region. Our commitment to quality and customer satisfaction has made us a preferred choice for agricultural needs in India.',
                'ನಾವು ಶಿವನಯ್ಯನಪಾಳ್ಯ, ಸಿರಾ, ತುಮಕೂರು, ಭಾರತದಲ್ಲಿ ನೆಲೆಗೊಂಡಿರುವ ವಿಶ್ವಾಸಾರ್ಹ ಕೃಷಿ ಸರಬರಾಜು ವ್ಯಾಪಾರ. 2020 ರಿಂದ, ಪ್ರದೇಶದ ರೈತರಿಗೆ ಗುಣಮಟ್ಟದ ನೇಪಿಯರ್ ಕಡ್ಡಿಗಳು, ಕೃಷಿ ಯಂತ್ರಗಳು, ಪಶುಸಂಗೋಪನೆ ಸಲಕರಣೆಗಳು ಮತ್ತು ಪ್ರೀಮಿಯಂ ಬೀಜಗಳನ್ನು ಒದಗಿಸುತ್ತಿದ್ದೇವೆ. ಗುಣಮಟ್ಟ ಮತ್ತು ಗ್ರಾಹಕ ತೃಪ್ತಿಗೆ ನಮ್ಮ ಬದ್ಧತೆಯು ನಮ್ಮನ್ನು ಭಾರತದಲ್ಲಿ ಕೃಷಿ ಅಗತ್ಯಗಳಿಗೆ ಆದ್ಯತೆಯ ಆಯ್ಕೆಯಾಗಿಸಿದೆ.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary to-accent relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-farm-gold/10 rounded-full translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-heading font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">
                  {t(stat.label.en, stat.label.kn)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-8 hover-lift-glow animate-fade-in-up">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                {t('Our Mission', 'ನಮ್ಮ ಮಿಷನ್')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(
                  'To empower farmers with high-quality Napier Sticks, agricultural products, machinery, and expert guidance that enhances productivity and sustains livelihoods across India.',
                  'ಭಾರತದಾದ್ಯಂತ ರೈತರಿಗೆ ಉತ್ಪಾದಕತೆಯನ್ನು ಹೆಚ್ಚಿಸುವ ಮತ್ತು ಜೀವನೋಪಾಯವನ್ನು ಉಳಿಸುವ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ನೇಪಿಯರ್ ಕಡ್ಡಿಗಳು, ಕೃಷಿ ಉತ್ಪನ್ನಗಳು, ಯಂತ್ರಗಳು ಮತ್ತು ತಜ್ಞ ಮಾರ್ಗದರ್ಶನದೊಂದಿಗೆ ಶಕ್ತಗೊಳಿಸುವುದು.'
                )}
              </p>
            </div>
            
            <div className="glass-card rounded-2xl p-8 hover-lift-glow animate-fade-in-up stagger-1">
              <div className="w-14 h-14 rounded-xl bg-farm-gold/20 flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-farm-gold" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                {t('Our Vision', 'ನಮ್ಮ ದೃಷ್ಟಿ')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(
                  'To be the most trusted agricultural partner for farmers in India, bridging traditional farming wisdom with modern agricultural solutions.',
                  'ಭಾರತದ ರೈತರಿಗೆ ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಕೃಷಿ ಪಾಲುದಾರರಾಗುವುದು, ಸಾಂಪ್ರದಾಯಿಕ ಕೃಷಿ ಜ್ಞಾನವನ್ನು ಆಧುನಿಕ ಕೃಷಿ ಪರಿಹಾರಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-gradient-gold py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-farm-gold/20 text-farm-gold text-sm font-semibold mb-4 animate-fade-in">
              {t('Our Team', 'ನಮ್ಮ ತಂಡ')}
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground animate-fade-in-up">
              {t('Meet Our Experts', 'ನಮ್ಮ ತಜ್ಞರನ್ನು ಭೇಟಿ ಮಾಡಿ')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto stagger-children">
            {team.map((member, idx) => (
              <div 
                key={member.name} 
                className="glass-card rounded-2xl p-6 text-center hover-lift-glow group"
              >
                <div className="relative inline-block mb-6">
                  {member.image ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto group-hover:scale-110 transition-transform duration-300 border-2 border-primary/20">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover object-center"
                        style={member.name === 'Mahesh' ? { objectPosition: 'center top' } : {}}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-farm-gold/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                  <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t(member.designation.en, member.designation.kn)}
                </p>
                {member.phone && (
                  <a 
                    href={`tel:${member.phone.replace(/\s/g, '')}`} 
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-farm-gold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 animate-fade-in">
              {t('Our Location', 'ನಮ್ಮ ಸ್ಥಳ')}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground animate-fade-in-up">
              {t('Visit Us', 'ನಮ್ಮನ್ನು ಭೇಟಿ ಮಾಡಿ')}
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <a 
              href="https://maps.app.goo.gl/AG61BvBpDjr2nZZT6"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group"
            >
              <div className="glass-card rounded-2xl overflow-hidden hover-lift-glow animate-fade-in-up">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-6 py-3 rounded-lg font-semibold text-gray-800">
                    {t('Click to open in Google Maps', 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ತೆರೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ')}
                  </span>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.123!2d76.9!3d13.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSira%2C+Tumkur%2C+Karnataka!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Natural Farm Sira Location"
                  className="pointer-events-none"
                />
              </div>
            </a>
            
            <div className="mt-4 text-center">
              <a
                href="https://maps.app.goo.gl/AG61BvBpDjr2nZZT6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                <MapPin className="w-5 h-5" />
                {t('Open in Google Maps', 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ')}
              </a>
            </div>
            
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6 flex items-start gap-4 hover-lift-glow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground mb-1">
                    {t('Address', 'ವಿಳಾಸ')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('Shivanayyanapalya, Sira, Tumkur, Karnataka, India', 'ಶಿವನಯ್ಯನಪಾಳ್ಯ, ಸಿರಾ, ತುಮಕೂರು, ಕರ್ನಾಟಕ, ಭಾರತ')}
                  </p>
                </div>
              </div>
              
              <div className="glass-card rounded-xl p-6 flex items-start gap-4 hover-lift-glow">
                <div className="w-12 h-12 rounded-xl bg-farm-gold/20 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-farm-gold" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground mb-1">
                    {t('Business Hours', 'ವ್ಯಾಪಾರ ಸಮಯ')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('Monday - Sunday: 7:00 AM - 10:00 PM', 'ಸೋಮವಾರ - ಭಾನುವಾರ: ಬೆಳಗ್ಗೆ 7 - ರಾತ್ರಿ 10')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
