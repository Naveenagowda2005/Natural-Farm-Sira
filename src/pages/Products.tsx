import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, subCategories, getProductsBySubCategory, getSubCategoriesByCategory } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const Products = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCat = searchParams.get('category') || categories[0].id;
  const [activeSub, setActiveSub] = useState<string | null>(null);

  const subs = useMemo(() => getSubCategoriesByCategory(activeCat), [activeCat]);

  const currentSub = activeSub && subs.find(s => s.id === activeSub) ? activeSub : subs[0]?.id;
  const filteredProducts = currentSub ? getProductsBySubCategory(currentSub) : [];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">
        {t('Our Products', 'ನಮ್ಮ ಉತ್ಪನ್ನಗಳು')}
      </h1>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSearchParams({ category: cat.id }); setActiveSub(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeCat === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {t(cat.nameEn, cat.nameKn)}
          </button>
        ))}
      </div>

      {/* Sub-category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {subs.map(sub => (
          <button
            key={sub.id}
            onClick={() => setActiveSub(sub.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              currentSub === sub.id
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            {t(sub.nameEn, sub.nameKn)}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          {t('No products found in this category.', 'ಈ ವಿಭಾಗದಲ್ಲಿ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ.')}
        </p>
      )}
    </main>
  );
};

export default Products;
