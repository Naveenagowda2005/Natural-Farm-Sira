import { useLanguage } from '@/contexts/LanguageContext';
import { Product, getWhatsAppLink } from '@/data/products';
import { MessageCircle, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const name = language === 'en' ? product.nameEn : product.nameKn;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <div className="aspect-square bg-muted flex items-center justify-center">
        <Package className="w-16 h-16 text-muted-foreground/40" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading text-base font-bold text-foreground leading-tight">{product.nameEn}</h3>
        {language === 'en' && (
          <p className="text-xs text-muted-foreground mt-0.5">{product.nameKn}</p>
        )}
        {language === 'kn' && (
          <p className="text-xs text-muted-foreground mt-0.5">{product.nameEn}</p>
        )}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{product.price}</span>
            {product.mrp && (
              <span className="text-sm text-muted-foreground line-through">{product.mrp}</span>
            )}
          </div>
          <a
            href={getWhatsAppLink(product.nameEn)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-whatsapp text-card font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-4 h-4" />
            {t('Order on WhatsApp', 'WhatsApp ನಲ್ಲಿ ಆರ್ಡರ್ ಮಾಡಿ')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
