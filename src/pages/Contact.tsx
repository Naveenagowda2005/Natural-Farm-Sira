import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MapPin, Send, MessageCircle, Mail, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) return;
    
    // Validate phone number is exactly 10 digits
    if (form.phone.length !== 10) {
      toast({
        title: t('Invalid phone number', 'ಅಮಾನ್ಯ ಫೋನ್ ಸಂಖ್ಯೆ'),
        description: t('Phone number must be exactly 10 digits', 'ಫೋನ್ ಸಂಖ್ಯೆ ನಿಖರವಾಗಿ 10 ಅಂಕಿಗಳಾಗಿರಬೇಕು'),
        variant: 'destructive',
      });
      return;
    }

    setSending(true);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: form.name,
          phone_number: form.phone,
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      toast({
        title: t('Message sent!', 'ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ!'),
        description: t('We will get back to you soon.', 'ನಾವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.'),
      });

      setForm({ name: '', phone: '', message: '' });
    } catch (error) {
      toast({
        title: t('Error', 'ದೋಷ'),
        description: t('Failed to send message. Please try again.', 'ಸಂದೇಶ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'),
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const contacts = [
    { name: 'Mahesh', phone: '+91 8660674360', role: { en: 'Founder', kn: 'ಸಂಸ್ಥಾಪಕ' } },
    { name: 'Omkar', phone: '+91 79753 47847', role: { en: 'Operations', kn: 'ಕಾರ್ಯಾಚರಣೆ' } },
    { name: 'Usha', phone: '+91 97408 05183', role: { en: 'Sales & Support', kn: 'ಮಾರಾಟ ಮತ್ತು ಬೆಂಬಲ' } },
    { name: 'Mahalakshmi', phone: '+91 9964254014', role: { en: 'Sales & Support', kn: 'ಮಾರಾಟ ಮತ್ತು ಬೆಂಬಲ' } },
  ];

  return (
    <main className="min-h-screen section-gradient">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-farm-gold/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in">
              {t('Contact Us', 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ')}
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
              {t('Get In Touch', 'ಸಂಪರ್ಕಿಸಿ')}
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up stagger-1">
              {t(
                'We\'re here to help! Reach out to us for any inquiries about our products or services.',
                'ನಾವು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇವೆ! ನಮ್ಮ ಉತ್ಪನ್ನಗಳು ಅಥವಾ ಸೇವೆಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ವಿಚಾರಣೆಗಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.'
              )}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="animate-slide-in-left">
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                {t('Send us a Message', 'ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-5 py-4 rounded-xl border bg-card text-foreground focus:outline-none transition-all ${
                      focused === 'name' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    maxLength={100}
                    placeholder=""
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focused === 'name' || form.name 
                      ? '-top-2.5 text-xs text-primary bg-card px-1' 
                      : 'top-4 text-base text-muted-foreground'
                  }`}>
                    {t('Your Name', 'ನಿಮ್ಮ ಹೆಸರು')}
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                      if (value.length <= 10) {
                        setForm(f => ({ ...f, phone: value }));
                      }
                    }}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                    className={`w-full px-5 py-4 rounded-xl border bg-card text-foreground focus:outline-none transition-all ${
                      focused === 'phone' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder=""
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focused === 'phone' || form.phone 
                      ? '-top-2.5 text-xs text-primary bg-card px-1' 
                      : 'top-4 text-base text-muted-foreground'
                  }`}>
                    {t('Phone Number', 'ಫೋನ್ ಸಂಖ್ಯೆ')}
                  </label>
                  {form.phone && form.phone.length < 10 && (
                    <p className="text-xs text-red-500 mt-1">
                      {t('Phone number must be 10 digits', 'ಫೋನ್ ಸಂಖ್ಯೆ 10 ಅಂಕಿಗಳಾಗಿರಬೇಕು')}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    rows={4}
                    className={`w-full px-5 py-4 rounded-xl border bg-card text-foreground focus:outline-none transition-all resize-none ${
                      focused === 'message' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    maxLength={1000}
                    placeholder=""
                    required
                  />
                  <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focused === 'message' || form.message 
                      ? '-top-2.5 text-xs text-primary bg-card px-1' 
                      : 'top-4 text-base text-muted-foreground'
                  }`}>
                    {t('Your Message', 'ನಿಮ್ಮ ಸಂದೇಶ')}
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-premium flex items-center justify-center gap-2 w-full py-4 rounded-xl text-lg disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('Sending...', 'ಕಳುಹಿಸುತ್ತಿದೆ...')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('Send Message', 'ಸಂದೇಶ ಕಳುಹಿಸಿ')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Quick Contact Cards */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                {t('Quick Contact', 'ತ್ವರಿತ ಸಂಪರ್ಕ')}
              </h2>
              
              <div className="space-y-4">
                {contacts.map((contact, idx) => (
                  <a
                    key={idx}
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{t(contact.role.en, contact.role.kn)}</p>
                      <p className="text-sm text-primary font-semibold">{contact.phone}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp Contact Options */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                {t('Chat on WhatsApp', 'WhatsApp ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('Choose who you want to contact', 'ನೀವು ಯಾರನ್ನು ಸಂಪರ್ಕಿಸಲು ಬಯಸುತ್ತೀರಿ ಆಯ್ಕೆಮಾಡಿ')}
              </p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/918660674360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-whatsapp/10 hover:bg-whatsapp/20 transition-colors group border border-whatsapp/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-whatsapp flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Mahesh</p>
                    <p className="text-sm text-muted-foreground">{t('Founder & Manager', 'ಸಂಸ್ಥಾಪಕ ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ')}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('Chat →', 'ಚಾಟ್ →')}
                  </div>
                </a>
                
                <a
                  href="https://wa.me/917975347847"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-whatsapp/10 hover:bg-whatsapp/20 transition-colors group border border-whatsapp/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-whatsapp flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">Omkar</p>
                    <p className="text-sm text-muted-foreground">{t('Operations Head', 'ಕಾರ್ಯಾಚರಣೆ ಮುಖ್ಯಸ್ಥ')}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('Chat →', 'ಚಾಟ್ →')}
                  </div>
                </a>
              </div>
            </div>

            {/* Location & Hours */}
            <div className="glass-card rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">
                      {t('Our Location', 'ನಮ್ಮ ಸ್ಥಳ')}
                    </h3>
                    <p className="text-muted-foreground">
                      Shivanayyanapalya, Sira, Tumkur, Karnataka, India
                    </p>
                    <a
                      href="https://maps.app.goo.gl/AG61BvBpDjr2nZZT6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-1 inline-block"
                    >
                      {t('Open in Maps', 'Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ')} →
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-farm-gold/20 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-farm-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-1">
                      {t('Business Hours', 'ವ್ಯಾಪಾರ ಸಮಯ')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('Monday - Sunday', 'ಸೋಮವಾರ - ಭಾನುವಾರ')}
                    </p>
                    <p className="text-sm text-primary font-semibold">
                      7:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
