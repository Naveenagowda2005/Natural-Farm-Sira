import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { testimonialsApi } from '@/lib/api';
import { Loader2, Star, Quote } from 'lucide-react';

const SuccessStories = () => {
  const { t } = useLanguage();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: testimonialsApi.getAllPublic,
  });

  return (
    <main className="min-h-screen section-gradient py-12">
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t('Customer Success', 'ಗ್ರಾಹಕ ಯಶಸ್ಸು')}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('Success Stories', 'ಯಶಸ್ಸಿನ ಕಥೆಗಳು')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('Hear from our satisfied customers', 'ನಮ್ಮ ತೃಪ್ತ ಗ್ರಾಹಕರಿಂದ ಕೇಳಿ')}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-card rounded-2xl overflow-hidden hover-lift-glow">
                {testimonial.media_url && (
                  <div className="relative aspect-video bg-muted">
                    {testimonial.media_type === 'image' ? (
                      <img src={testimonial.media_url} alt={testimonial.customer_name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={testimonial.media_url} controls className="w-full h-full" />
                    )}
                  </div>
                )}
                <div className="p-6">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-farm-gold fill-farm-gold' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-4 italic">"{testimonial.message}"</p>
                  <div className="pt-4 border-t">
                    <p className="font-bold">{testimonial.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{t('Verified Customer', 'ಪರಿಶೀಲಿತ ಗ್ರಾಹಕ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default SuccessStories;
