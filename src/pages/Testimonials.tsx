          {t('Browse Products', 'ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ')}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg bg-secondary text-secondary-foreground font-bold hover:opacity-90 transition-all"
              >
                {t('Contact Us', 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ')}
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Testimonials;
    <p className="text-muted-foreground text-lg mb-8">
              {t(
                'Experience quality products and excellent service',
                'ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಅತ್ಯುತ್ತಮ ಸೇವೆಯನ್ನು ಅನುಭವಿಸಿ'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="btn-premium inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg"
              >
               </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      {testimonials.length > 0 && (
        <div className="container mx-auto px-4 mt-16">
          <div className="glass-card rounded-3xl p-12 text-center max-w-3xl mx-auto hover-lift-glow">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('Join Our Happy Customers', 'ನಮ್ಮ ಸಂತೋಷದ ಗ್ರಾಹಕರನ್ನು ಸೇರಿ')}
            </h2>
        ">
                    "{testimonial.message}"
                  </p>

                  {/* Customer Name */}
                  <div className="pt-4 border-t border-border">
                    <p className="font-heading font-bold text-foreground">
                      {testimonial.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('Verified Customer', 'ಪರಿಶೀಲಿತ ಗ್ರಾಹಕ')}
                    </p>
                  </div>
                   {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? 'text-farm-gold fill-farm-gold'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Message */}
                  <p className="text-foreground leading-relaxed mb-4 italic   controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-primary/30" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
         bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
                    {testimonial.media_type === 'image' ? (
                      <img
                        src={testimonial.media_url}
                        alt={testimonial.customer_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={testimonial.media_url}
                     }
                {testimonial.media_url && (
                  <div className="relative aspect-video್ಯವಿಲ್ಲ')}
            </p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className="glass-card rounded-2xl overflow-hidden hover-lift-glow animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Media */  {t('No testimonials available yet', 'ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಶಂಸಾಪತ್ರಗಳು ಲಭ 'ನ್ಯಾಚುರಲ್ ಫಾರ್ಮ್ ಸಿರಾದೊಂದಿಗಿನ ಅವರ ಅನುಭವದ ಬಗ್ಗೆ ನಮ್ಮ ತೃಪ್ತ ಗ್ರಾಹಕರಿಂದ ಕೇಳಿ'
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
            lassName="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up stagger-1">
            {t(
              'Hear from our satisfied customers about their experience with Natural Farm Sira',
             ಥೆಗಳು')}
          </h1>
          <p c   {t('Success Stories', 'ಯಶಸ್ಸಿನ ಕ
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 animate-fade-in">
            {t('Customer Success', 'ಗ್ರಾಹಕ ಯಶಸ್ಸು')}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
         lassName="container mx-auto px-4 mb-10">section-gradient py-12">
      {/* Header */}
      <div ctestimonialsApi } from '@/lib/api';
import { Loader2, Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const { t } = useLanguage();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: testimonialsApi.getAllPublic,
  });

  return (
    <main className="min-h-screen age } from '@/contexts/LanguageContext';
import { import { useQuery } from '@tanstack/react-query';
import { useLangu