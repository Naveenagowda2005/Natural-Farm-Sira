import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) return;

    setSending(true);
    // Store locally for now (admin dashboard will use backend later)
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.push({ ...form, date: new Date().toISOString() });
    localStorage.setItem('inquiries', JSON.stringify(inquiries));

    toast({
      title: t('Message sent!', 'ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ!'),
      description: t('We will get back to you soon.', 'ನಾವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.'),
    });

    setForm({ name: '', phone: '', message: '' });
    setSending(false);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-center mb-10">
        {t('Contact Us', 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">{t('Name', 'ಹೆಸರು')}</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{t('Phone Number', 'ಫೋನ್ ಸಂಖ್ಯೆ')}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              maxLength={15}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">{t('Message', 'ಸಂದೇಶ')}</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none"
              maxLength={1000}
              required
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {t('Send Message', 'ಸಂದೇಶ ಕಳುಹಿಸಿ')}
          </button>
        </form>

        {/* Contact info */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-heading text-lg font-bold mb-4">{t('Reach Us', 'ನಮ್ಮನ್ನು ತಲುಪಿ')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Sira, Tumkur, Karnataka, India</span>
              </div>
              {[
                { name: 'Mahesh', phone: '8660674360' },
                { name: 'Omkar', phone: '+91 79753 47847' },
                { name: 'Usha', phone: '+91 97408 05183' },
                { name: 'Mahalakshmi', phone: '9964254014' },
              ].map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                    {c.phone} ({c.name})
                  </a>
                </div>
              ))}
            </div>
          </div>
          <a
            href="https://maps.app.goo.gl/AG61BvBpDjr2nZZT6"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3 rounded-lg border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            📍 {t('Open in Google Maps', 'Google Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ')}
          </a>
        </div>
      </div>
    </main>
  );
};

export default Contact;
