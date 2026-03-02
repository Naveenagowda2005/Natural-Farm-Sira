import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImageIcon, Camera, Heart, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface GalleryImage {
  id: string;
  image_url: string;
  created_at: string;
}

const fetchPublicGallery = async (): Promise<GalleryImage[]> => {
  const response = await fetch(`${API_BASE_URL}/api/gallery/public`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery images');
  }
  return response.json();
};

const Gallery = () => {
  const { t } = useLanguage();

  const { data: galleryImages = [], isLoading } = useQuery({
    queryKey: ['public-gallery'],
    queryFn: fetchPublicGallery,
  });

  return (
    <main className="min-h-screen section-gradient">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-farm-gold/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in">
              {t('Gallery', 'ಗ್ಯಾಲರಿ')}
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
              {t('Our Moments', 'ನಮ್ಮ ಕ್ಷಣಗಳು')}
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up stagger-1">
              {t(
                'Capturing the essence of farming life and our journey with India\'s farmers',
                'ಭಾರತದ ರೈತರೊಂದಿಗೆ ನಮ್ಮ ಪ್ರಯಾಣದ ಮತ್ತು ಕೃಷಿ ಜೀವನದ ಸಾರವನ್ನು ಸೆರೆಹಿಡಿಯುವುದು'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-card rounded-2xl p-10 max-w-2xl mx-auto animate-fade-in-up">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  {t('Gallery Coming Soon!', 'ಗ್ಯಾಲರಿ ಶೀಘ್ರದಲ್ಲೇ!')}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t(
                    'We\'re working on adding photos and videos of our products, store, and events. Stay tuned!',
                    'ನಮ್ಮ ಉತ್ಪನ್ನಗಳು, ಅಂಗಡಿ ಮತ್ತು ಘಟನೆಗಳ ಫೋಟೋಗಳು ಮತ್ತು ವೀಡಿಯೊಗಳನ್ನು ಸೇರಿಸುತ್ತಿದ್ದೇವೆ. ನಿಮ್ಮ ಕಾಯ್ದಿರಿ!'
                  )}
                </p>
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Heart className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold">{t('Follow us for updates', 'ಅಪ್ಡೇಟ್‌ಗಳಿಗಾಗಿ ಫಾಲೋ ಮಾಡಿ')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
              {galleryImages.map((image, idx) => (
                <div 
                  key={image.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover-lift-glow"
                >
                  {/* Image */}
                  <img
                    src={image.image_url}
                    alt={`Gallery image ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Corner Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Gallery;
