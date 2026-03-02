import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhatsAppFab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const contacts = [
    { 
      name: 'Mahesh', 
      role: { en: 'Founder & Manager', kn: 'ಸಂಸ್ಥಾಪಕ ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ' },
      phone: '918660674360',
      message: 'Hi, I want to know about your products.'
    },
    { 
      name: 'Omkar', 
      role: { en: 'Operations Head', kn: 'ಕಾರ್ಯಾಚರಣೆ ಮುಖ್ಯಸ್ಥ' },
      phone: '917975347847',
      message: 'Hi, I want to know about your products.'
    },
  ];

  return (
    <>
      {/* Popup Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-72 bg-card rounded-2xl shadow-2xl border border-border animate-fade-in-up">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {t('Chat on WhatsApp', 'WhatsApp ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ')}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 space-y-2">
            {contacts.map((contact) => (
              <a
                key={contact.name}
                href={`https://wa.me/${contact.phone}?text=${encodeURIComponent(contact.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-whatsapp/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-whatsapp flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{t(contact.role.en, contact.role.kn)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-whatsapp text-card shadow-lg hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </>
  );
};

export default WhatsAppFab;
