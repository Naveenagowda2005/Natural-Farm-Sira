import { useLanguage } from '@/contexts/LanguageContext';
import { User } from 'lucide-react';

const team = [
  { name: 'Mahesh', designation: { en: 'Founder & Manager', kn: 'ಸಂಸ್ಥಾಪಕ ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ' }, phone: '8660674360' },
  { name: 'Omkar', designation: { en: 'Operations Head', kn: 'ಕಾರ್ಯಾಚರಣೆ ಮುಖ್ಯಸ್ಥ' }, phone: '+91 79753 47847' },
  { name: 'Usha', designation: { en: 'Sales & Support', kn: 'ಮಾರಾಟ ಮತ್ತು ಬೆಂಬಲ' }, phone: '+91 97408 05183' },
  { name: 'Mahalakshmi', designation: { en: 'Customer Relations', kn: 'ಗ್ರಾಹಕ ಸಂಬಂಧಗಳು' }, phone: '9964254014' },
];

const About = () => {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-center mb-4">
        {t('About Natural Farm Sira', 'ನ್ಯಾಚುರಲ್ ಫಾರ್ಮ್ ಸಿರಾ ಬಗ್ಗೆ')}
      </h1>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        {t(
          'We are a trusted agricultural supply business based in Sira, Tumkur, Karnataka. We provide quality farm machines, livestock accessories, and seeds to farmers across the region.',
          'ನಾವು ಸಿರಾ, ತುಮಕೂರು, ಕರ್ನಾಟಕದಲ್ಲಿ ನೆಲೆಗೊಂಡಿರುವ ವಿಶ್ವಾಸಾರ್ಹ ಕೃಷಿ ಸರಬರಾಜು ವ್ಯಾಪಾರ. ಪ್ರದೇಶದ ರೈತರಿಗೆ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಯಂತ್ರಗಳು, ಪಶುಸಂಗೋಪನೆ ಸಲಕರಣೆಗಳು ಮತ್ತು ಬೀಜಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.'
        )}
      </p>

      <h2 className="font-heading text-2xl font-bold text-center mb-8">
        {t('Our Team', 'ನಮ್ಮ ತಂಡ')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {team.map(member => (
          <div key={member.name} className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-bold">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{t(member.designation.en, member.designation.kn)}</p>
            <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="text-sm text-primary mt-2 inline-block hover:underline">
              {member.phone}
            </a>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="mt-16">
        <h2 className="font-heading text-2xl font-bold text-center mb-6">
          {t('Our Location', 'ನಮ್ಮ ಸ್ಥಳ')}
        </h2>
        <div className="rounded-xl overflow-hidden border border-border max-w-3xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.123!2d76.9!3d13.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSira%2C+Tumkur%2C+Karnataka!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Natural Farm Sira Location"
          />
        </div>
      </div>
    </main>
  );
};

export default About;
