import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ProductCardProps {
  product: {
    id: string;
    nameEn: string;
    nameKn: string;
    description?: string;
    price: string;
    mrp: string;
    subCategoryId: string;
    imageUrl?: string;
  };
}

const getWhatsAppLink = (productName: string) => {
  const message = encodeURIComponent(`Hi, I'm interested in ordering: ${productName}. Please share details.`);
  return `https://wa.me/918660674360?text=${message}`;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const image = product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image';
  const hasDescription = product.description && product.description.trim().length > 0;

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col hover-lift-glow">
      {/* Image Section */}
      <div className="relative aspect-square bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
        <img
          src={image}
          alt={product.nameEn}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
          <span className="text-lg font-bold text-primary">{product.price}</span>
          {product.mrp && (
            <span className="text-sm text-muted-foreground line-through ml-2">{product.mrp}</span>
          )}
        </div>
        
        {/* Discount Badge */}
        {product.mrp && product.mrp !== '' && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-farm-gold text-secondary-foreground text-sm font-bold animate-pulse-glow">
            {Math.round((1 - parseFloat(product.price.replace(/[^0-9.]/g, '')) / parseFloat(product.mrp.replace(/[^0-9.]/g, ''))) * 100)}% OFF
          </div>
        )}
        
        {/* Quick Action Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <a
            href={getWhatsAppLink(product.nameEn)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-whatsapp text-card font-bold hover:bg-whatsapp/90 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            {t('Order on WhatsApp', 'WhatsApp ನಲ್ಲಿ ಆರ್ಡರ್ ಮಾಡಿ')}
          </a>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-base font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
          {product.nameEn}
        </h3>
        {language === 'en' && (
          <p className="text-xs text-muted-foreground">{product.nameKn}</p>
        )}
        {language === 'kn' && (
          <p className="text-xs text-muted-foreground">{product.nameEn}</p>
        )}
        
        {/* Rating / Quick Info */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs text-farm-gold">
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({t('Quality Verified', 'ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಿತ')})
          </span>
        </div>
        
        {/* Description Button */}
        {hasDescription && (
          <button
            onClick={() => setIsDescriptionOpen(true)}
            className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            <Info className="w-4 h-4" />
            {t('View Details', 'ವಿವರಗಳನ್ನು ನೋಡಿ')}
          </button>
        )}
        
        {/* Mobile Order Button */}
        <div className="mt-auto pt-4 lg:hidden">
          <a
            href={getWhatsAppLink(product.nameEn)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-whatsapp text-card font-semibold text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            {t('Order', 'ಆರ್ಡರ್')}
          </a>
        </div>
      </div>
      
      {/* Description Dialog */}
      <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-heading">
              {language === 'en' ? product.nameEn : product.nameKn}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {language === 'en' ? product.nameKn : product.nameEn}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto pr-2 flex-1" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            {/* Product Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={image}
                alt={product.nameEn}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Price Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">{t('Price', 'ಬೆಲೆ')}</p>
                <p className="text-2xl font-bold text-primary">{product.price}</p>
              </div>
              {product.mrp && product.mrp !== '' && (
                <>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('MRP', 'ಎಂ.ಆರ್.ಪಿ')}</p>
                    <p className="text-xl font-semibold text-muted-foreground line-through">{product.mrp}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-4 py-2 rounded-full bg-farm-gold text-secondary-foreground font-bold">
                      {Math.round((1 - parseFloat(product.price.replace(/[^0-9.]/g, '')) / parseFloat(product.mrp.replace(/[^0-9.]/g, ''))) * 100)}% OFF
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">{t('Product Information', 'ಉತ್ಪನ್ನ ಮಾಹಿತಿ')}</h4>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
          
          {/* Order Button - Sticky at bottom */}
          <div className="flex-shrink-0 pt-4 border-t">
            <a
              href={getWhatsAppLink(product.nameEn)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-whatsapp text-card font-bold hover:bg-whatsapp/90 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              {t('Order on WhatsApp', 'WhatsApp ನಲ್ಲಿ ಆರ್ಡರ್ ಮಾಡಿ')}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCard;
