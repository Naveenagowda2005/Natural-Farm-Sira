import { MessageCircle } from 'lucide-react';

const WhatsAppFab = () => {
  return (
    <a
      href="https://wa.me/918660674360?text=Hi%2C%20I%20want%20to%20know%20about%20your%20products."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-whatsapp text-card shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppFab;
