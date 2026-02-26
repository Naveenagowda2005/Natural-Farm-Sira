import { useLanguage } from '@/contexts/LanguageContext';
import { ImageIcon } from 'lucide-react';

const Gallery = () => {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold text-center mb-4">
        {t('Gallery', 'ಗ್ಯಾಲರಿ')}
      </h1>
      <p className="text-center text-muted-foreground mb-12">
        {t('Photos and videos from Natural Farm Sira', 'ನ್ಯಾಚುರಲ್ ಫಾರ್ಮ್ ಸಿರಾ ಫೋಟೋಗಳು ಮತ್ತು ವೀಡಿಯೊಗಳು')}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border"
          >
            <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        {t('Gallery content will be managed by the admin.', 'ಗ್ಯಾಲರಿ ವಿಷಯವನ್ನು ನಿರ್ವಾಹಕರು ನಿರ್ವಹಿಸುತ್ತಾರೆ.')}
      </p>
    </main>
  );
};

export default Gallery;
