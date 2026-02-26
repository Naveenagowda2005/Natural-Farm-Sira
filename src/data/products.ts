export interface Product {
  id: string;
  nameEn: string;
  nameKn: string;
  price: string;
  mrp: string;
  subCategoryId: string;
}

export interface SubCategory {
  id: string;
  nameEn: string;
  nameKn: string;
  categoryId: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameKn: string;
}

export const categories: Category[] = [
  { id: 'agri-machines', nameEn: 'Agricultural Machines', nameKn: 'ಕೃಷಿ ಯಂತ್ರಗಳು' },
  { id: 'livestock', nameEn: 'Livestock & Farm Accessories', nameKn: 'ಪಶುಸಂಗೋಪನೆ ಉತ್ಪನ್ನಗಳು' },
  { id: 'seeds', nameEn: 'Seeds & Planting Material', nameKn: 'ಬೀಜಗಳು ಮತ್ತು ನೆಡುವ ವಸ್ತುಗಳು' },
];

export const subCategories: SubCategory[] = [
  { id: 'milking', nameEn: 'Milking Machines', nameKn: 'ಹಾಲು ಕಡಿಯುವ ಯಂತ್ರಗಳು', categoryId: 'agri-machines' },
  { id: 'chaff', nameEn: 'Chaff Cutter', nameKn: 'ಚಾಫ್ ಕಟರ್', categoryId: 'agri-machines' },
  { id: 'rotary', nameEn: 'Front Rotary', nameKn: 'ಫ್ರಂಟ್ ರೋಟರಿ', categoryId: 'agri-machines' },
  { id: 'washer', nameEn: 'High Pressure Washer', nameKn: 'ಹೈ ಪ್ರೆಶರ್ ವಾಷರ್', categoryId: 'agri-machines' },
  { id: 'wheelbarrow', nameEn: 'Wheel Barrow', nameKn: 'ಕಸ ಎತ್ತುವ ಗಾಡಿ', categoryId: 'agri-machines' },
  { id: 'goat-mats', nameEn: 'Goat Mats', nameKn: 'ಮೇಕೆ ಮ್ಯಾಟ್‌ಗಳು', categoryId: 'livestock' },
  { id: 'silage', nameEn: 'Silage Bags (PP / HDPE)', nameKn: 'ಸೈಲೇಜ್ ಬ್ಯಾಗ್‌ಗಳು', categoryId: 'livestock' },
  { id: 'azolla', nameEn: 'Azolla & Vermi Beds', nameKn: 'ಅಜೋಲಾ / ವರ್ಮಿ ಬೆಡ್', categoryId: 'livestock' },
  { id: 'sugarcane', nameEn: 'Sugarcane Sticks', nameKn: 'ಕಬ್ಬಿನ ಕಡ್ಡಿಗಳು', categoryId: 'seeds' },
  { id: 'fodder', nameEn: 'Fodder Seeds', nameKn: 'ಮೇವು ಬೀಜಗಳು', categoryId: 'seeds' },
];

export const products: Product[] = [
  { id: 'agf-01', nameEn: 'AGF-01 Milking Machine', nameKn: 'ಮಿಲ್ಕ್ ಮೆಷಿನ್', price: '₹38,000', mrp: '₹55,000', subCategoryId: 'milking' },
  { id: 'agf-02', nameEn: 'AGF-02 Milking Machine', nameKn: 'ಮಿಲ್ಕ್ ಮೆಷಿನ್', price: '₹54,000', mrp: '₹80,000', subCategoryId: 'milking' },
  { id: 'agf-03', nameEn: 'AGF-03 Milking Machine', nameKn: 'ಮಿಲ್ಕ್ ಮೆಷಿನ್', price: '₹17,000', mrp: '₹28,000', subCategoryId: 'milking' },
  { id: 'chaff-gokul', nameEn: 'Gokul Model Chaff Cutter', nameKn: 'ಗೋಕುಲ್ ಚಾಫ್ ಕಟರ್', price: '₹24,000', mrp: '₹34,000', subCategoryId: 'chaff' },
  { id: 'chaff-fmtti', nameEn: 'Chaff Cutter (FMTTI Approved)', nameKn: 'ಎಫ್‌ಎಂಟಿಟಿಐ ಮಾನ್ಯತೆ ಪಡೆದ ಚಾಫ್ ಕಟರ್', price: '₹30,000', mrp: '₹36,000', subCategoryId: 'chaff' },
  { id: 'chaff-cc06', nameEn: 'Chaff Cutter Model CC-NB-06', nameKn: 'ಚಾಫ್ ಕಟರ್ ಯಂತ್ರ', price: '₹24,000', mrp: '₹28,000', subCategoryId: 'chaff' },
  { id: 'rotary-12', nameEn: 'Front Rotary – 12 Inch', nameKn: 'ಫ್ರಂಟ್ ರೋಟರಿ', price: '₹27,990', mrp: '₹31,990', subCategoryId: 'rotary' },
  { id: 'rotary-15', nameEn: 'Front Rotary – 15 Inch', nameKn: 'ಫ್ರಂಟ್ ರೋಟರಿ', price: '₹29,990', mrp: '₹33,990', subCategoryId: 'rotary' },
  { id: 'rotary-18', nameEn: 'Front Rotary – 18 Inch', nameKn: 'ಫ್ರಂಟ್ ರೋಟರಿ', price: '₹30,990', mrp: '₹35,990', subCategoryId: 'rotary' },
  { id: 'washer-basic', nameEn: 'High Pressure Washer – Basic', nameKn: 'ಜಪಾನಿಸ್ ಟೆಕ್ನಾಲಜಿ ವಾಷರ್', price: '₹7,000', mrp: '₹9,500', subCategoryId: 'washer' },
  { id: 'washer-2500', nameEn: 'High Pressure Washer – 2500W', nameKn: 'ಜಪಾನಿಸ್ ಟೆಕ್ನಾಲಜಿ ವಾಷರ್', price: '₹9,500', mrp: '₹12,000', subCategoryId: 'washer' },
  { id: 'wheelbarrow-1', nameEn: 'Wheel Barrow', nameKn: 'ಕಸ ಎತ್ತುವ ಗಾಡಿ', price: '₹3,500', mrp: '₹4,800', subCategoryId: 'wheelbarrow' },
  { id: 'goat-mat-21', nameEn: 'Goat Mat 2×1 – 45mm', nameKn: 'ಮೇಕೆ ಮ್ಯಾಟ್', price: '₹320', mrp: '₹380', subCategoryId: 'goat-mats' },
  { id: 'goat-mat-22-65', nameEn: 'Goat Mat 2×2 – 65mm', nameKn: 'ಮೇಕೆ ಮ್ಯಾಟ್', price: '₹520', mrp: '₹580', subCategoryId: 'goat-mats' },
  { id: 'goat-mat-22-75', nameEn: 'Goat Mat 2×2 – 75mm', nameKn: 'ಮೇಕೆ ಮ್ಯಾಟ್', price: '₹560', mrp: '₹620', subCategoryId: 'goat-mats' },
  { id: 'silage-sm', nameEn: 'Silage Bag – Small', nameKn: 'ಸೈಲೇಜ್ ಬ್ಯಾಗ್', price: '₹80', mrp: '₹100', subCategoryId: 'silage' },
  { id: 'silage-md', nameEn: 'Silage Bag – Medium', nameKn: 'ಸೈಲೇಜ್ ಬ್ಯಾಗ್', price: '₹280', mrp: '₹300', subCategoryId: 'silage' },
  { id: 'silage-lg', nameEn: 'Silage Bag – Large', nameKn: 'ಸೈಲೇಜ್ ಬ್ಯಾಗ್', price: '₹350', mrp: '₹400', subCategoryId: 'silage' },
  { id: 'azolla-bed', nameEn: 'Azolla Bed', nameKn: 'ಅಜೋಲಾ ಬೆಡ್', price: '₹1,400', mrp: '₹1,800', subCategoryId: 'azolla' },
  { id: 'vermi-bed', nameEn: 'Vermi Bed', nameKn: 'ವರ್ಮಿ ಬೆಡ್', price: '₹1,600', mrp: '₹2,000', subCategoryId: 'azolla' },
  { id: 'sugarcane-thai', nameEn: 'Thailand Super Sugarcane', nameKn: 'ಥೈಲ್ಯಾಂಡ್ ಸೂಪರ್ ಕಬ್ಬು', price: '₹2–₹3/stick', mrp: '', subCategoryId: 'sugarcane' },
  { id: 'sugarcane-aus', nameEn: 'Australian Red Sugarcane', nameKn: 'ಆಸ್ಟ್ರೇಲಿಯನ್ ರೆಡ್ ಕಬ್ಬು', price: '₹2–₹3/stick', mrp: '', subCategoryId: 'sugarcane' },
  { id: 'sugarcane-indo', nameEn: 'Indonesia Smart Sugarcane', nameKn: 'ಇಂಡೋನೇಷಿಯಾ ಸ್ಮಾರ್ಟ್ ಕಬ್ಬು', price: '₹2–₹3/stick', mrp: '', subCategoryId: 'sugarcane' },
  { id: 'flax-seeds', nameEn: 'Flax Seeds', nameKn: 'ಅಗಸೆ ಬೀಜ', price: '₹800', mrp: '₹1,000', subCategoryId: 'fodder' },
  { id: 'cof-31', nameEn: 'COF-31 Fodder Seeds', nameKn: 'COF-31 ಮೇವು ಬೀಜ', price: '₹800', mrp: '₹1,000', subCategoryId: 'fodder' },
  { id: 'alfalfa', nameEn: 'Alfalfa (Lucerne)', nameKn: 'ಅಲ್ಫಾಲ್ಫಾ / ಲ್ಯೂಸೇನ್', price: '₹900', mrp: '₹1,100', subCategoryId: 'fodder' },
];

export const getProductsBySubCategory = (subCategoryId: string) =>
  products.filter(p => p.subCategoryId === subCategoryId);

export const getSubCategoriesByCategory = (categoryId: string) =>
  subCategories.filter(sc => sc.categoryId === categoryId);

export const getWhatsAppLink = (productName: string) => {
  const message = encodeURIComponent(`Hi, I'm interested in ordering: ${productName}. Please share details.`);
  return `https://wa.me/918660674360?text=${message}`;
};
