import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { categoriesApi, subCategoriesApi, productsApi, type Category, type SubCategory, type Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, Loader2 } from 'lucide-react';

const Products = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch categories, subcategories, and products from API (public endpoints)
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['public-categories'],
    queryFn: categoriesApi.getAllPublic,
  });

  const { data: allSubCategories = [], isLoading: subCategoriesLoading } = useQuery({
    queryKey: ['public-subcategories'],
    queryFn: subCategoriesApi.getAllPublic,
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['public-products'],
    queryFn: () => productsApi.getAllPublic(),
  });

  const activeCat = searchParams.get('category') || categories[0]?.id;

  // Filter subcategories by active category
  const subs = useMemo(
    () => allSubCategories.filter(sc => sc.category_id === activeCat),
    [allSubCategories, activeCat]
  );

  const currentSub = activeSub && subs.find(s => s.id === activeSub) ? activeSub : subs[0]?.id;

  // Filter products by current subcategory
  const filteredProducts = useMemo(
    () => currentSub ? allProducts.filter(p => p.subcategory_id === currentSub) : [],
    [allProducts, currentSub]
  );

  const handleCategoryChange = (catId: string) => {
    setIsAnimating(true);
    setSearchParams({ category: catId });
    setActiveSub(null);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const isLoading = categoriesLoading || subCategoriesLoading || productsLoading;

  return (
    <main className="min-h-screen section-gradient py-12">
      {/* Header */}
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 animate-fade-in">
            {t('Premium Quality', 'ಪ್ರೀಮಿಯಂ ಗುಣಮಟ್ಟ')}
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
            {t('Our Products', 'ನಮ್ಮ ಉತ್ಪನ್ನಗಳು')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up stagger-1">
            {t(
              'Discover our wide range of agricultural products, machinery, and accessories',
              'ನಮ್ಮ ವ್ಯಾಪಕ ಶ್ರೇಣಿಯ ಕೃಷಿ ಉತ್ಪನ್ನಗಳು, ಯಂತ್ರಗಳು ಮತ್ತು ಸಲಕರಣೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ'
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCat === cat.id
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg glow-primary'
                    : 'glass-card text-foreground hover:bg-primary/10 hover:scale-105'
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {language === 'en' ? cat.name_en : cat.name_kn}
              </button>
            ))}
          </div>

          {/* Sub-category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {subs.map((sub, idx) => (
              <button
                key={sub.id}
                onClick={() => {
                  setIsAnimating(true);
                  setActiveSub(sub.id);
                  setTimeout(() => setIsAnimating(false), 300);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  currentSub === sub.id
                    ? 'bg-gradient-to-r from-farm-gold to-farm-amber text-secondary-foreground shadow-lg glow-gold'
                    : 'glass-card text-foreground hover:bg-farm-gold/10 hover:scale-105'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {language === 'en' ? sub.name_en : sub.name_kn}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {filteredProducts.map((product, idx) => (
              <div 
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <ProductCard 
                  product={{
                    id: product.id,
                    nameEn: product.name_en,
                    nameKn: product.name_kn,
                    description: product.description,
                    price: `₹${product.price.toLocaleString()}`,
                    mrp: product.mrp ? `₹${product.mrp.toLocaleString()}` : '',
                    subCategoryId: product.subcategory_id,
                    imageUrl: product.image_url,
                  }} 
                />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                {t('No products found', 'ಯಾವ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ')}
              </h3>
              <p className="text-muted-foreground">
                {t('Try selecting a different category', 'ವಿಭಿನ್ನ ವಿಭಾಗವನ್ನು ಆರಿಸಿ ಪ್ರಯತ್ನಿಸಿ')}
              </p>
            </div>
          )}

          {/* Info Section */}
          {filteredProducts.length > 0 && (
            <div className="mt-16 glass-card rounded-2xl p-8 animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Filter className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {t('Need help choosing?', 'ಆಯ್ಕೆ ಮಾಡಲು ಸಹಾಯ ಬೇಕೇ?')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(
                      'Contact us on WhatsApp for personalized product recommendations and bulk orders',
                      'ವೈಯಕ್ತಿಕ ಉತ್ಪನ್ನ ಶಿಫಾರಸುಗಳು ಮತ್ತು ದೊಡ್ಡ ಆರ್ಡರ್‌ಗಳಿಗಾಗಿ WhatsApp ನಲ್ಲಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Products;
