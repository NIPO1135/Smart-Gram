
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Milk, Egg, Fish, Drumstick, MessageCircle } from 'lucide-react';
import { useAppConfig, PopularProductIconKey } from '../context/AppConfigContext';

interface Product {
  id: string;
  name: string;
  icon: React.ElementType;
  image?: string;
  color: string;
  price: string;
  unit: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { t } = useLanguage();
  
  const handleOrder = () => {
    const message = `${t.whatsappMsg} ${product.name}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "8801700000000"; 
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="flex-shrink-0 w-44 bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all snap-start flex flex-col">
      {/* Product Image Placeholder */}
      <div className={`${product.color} w-full h-28 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group`}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <product.icon className="w-12 h-12 relative z-10 transition-transform duration-500 group-hover:scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-50"></div>
      </div>
      
      {/* Product Info */}
      <div className="flex-1 text-center space-y-1 mb-5">
        <h4 className="text-[13px] font-extrabold text-gray-800 leading-tight min-h-[2rem] flex items-center justify-center">
          {product.name}
        </h4>
        <div className="flex flex-col items-center">
          <span className="text-xl font-black text-green-600">৳{product.price}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            {product.unit}
          </span>
        </div>
      </div>

      {/* WhatsApp Order Button */}
      <button 
        onClick={handleOrder}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-md shadow-green-600/10 active:scale-95 transition-all"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span className="text-[11px] font-bold uppercase tracking-tight">{t.orderNow}</span>
      </button>
    </div>
  );
};

const PopularProducts: React.FC = () => {
  const { t } = useLanguage();
  const { config, } = useAppConfig();

  const ICONS: Record<PopularProductIconKey, React.ElementType> = {
    Milk,
    Egg,
    Fish,
    Meat: Drumstick,
  };

  const products: Product[] = config.popularProducts
    .filter((p) => p.enabled)
    .map((p) => ({
      id: p.id,
      name: t[p.id as keyof typeof t] ?? (p.name.en || p.name.bn),
      icon: ICONS[p.iconKey],
      image: p.image,
      color: p.color,
      price: p.price,
      unit: p.unit.en || p.unit.bn,
    }));

  return (
    <div className="mt-6 mb-4 px-1 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
      <div className="mb-4">
        <h3 className="text-lg font-black text-green-900 border-l-4 border-green-600 pl-3 leading-none">
          {t.popularProducts}
        </h3>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4 snap-x no-scrollbar">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Extra spacer for scroll */}
        <div className="flex-shrink-0 w-2"></div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PopularProducts;
