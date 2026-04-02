
import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Globe, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Package,
  ShoppingBasket
} from 'lucide-react';
import { useAppConfig } from '../context/AppConfigContext';

type ShopSubView = 'selection' | 'handmade';

const ShoppingPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [subView, setSubView] = useState<ShopSubView>('selection');
  const { config } = useAppConfig();

  const handmadeProducts = useMemo(
    () =>
      config.handmadeProducts
        .filter((p) => p.enabled)
        .map((p) => ({
          id: p.id,
          name: language === 'bn' ? p.name.bn : p.name.en,
          price: p.price,
          unit: language === 'bn' ? p.unit.bn : p.unit.en,
          image: p.image,
        })),
    [config.handmadeProducts, language],
  );

  const handleWhatsAppOrder = (productName: string) => {
    const whatsappNumber = "8801700000000"; 
    const message = encodeURIComponent(`${t.whatsappOrderMsg}${productName}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const openOnlineShop = () => {
    window.open('https://ozysa.com', '_blank');
  };

  if (subView === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 pb-40 animate-in fade-in duration-500">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 pt-6 pb-5 sticky top-0 z-40 border-b-2 border-green-200 shadow-sm">
          <div className="flex items-center space-x-4 mb-2">
            <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors active:scale-95">
              <ArrowLeft className="w-6 h-6 text-green-700" />
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-green-900 leading-tight">{t.shopTitle}</h2>
              <p className="text-xs text-green-600 mt-1">
                {language === 'bn' ? 'স্থানীয় পণ্য এবং হস্তশিল্প কিনুন' : 'Buy local products and handicrafts'}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-2xl">
              <ShoppingBag className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-2xl mx-auto mt-4">
          {/* Online Shopping Button */}
          <button 
            onClick={openOnlineShop}
            className="w-full bg-gradient-to-br from-white to-green-50 border-2 border-green-200 rounded-[3rem] p-8 text-left shadow-xl shadow-green-900/10 hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden active:scale-98"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-60"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-green-50 rounded-full opacity-40"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-6 rounded-3xl shadow-xl shadow-green-600/40 group-hover:scale-110 transition-transform">
                  <Globe className="text-white w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-2xl font-black text-green-900">{t.onlineShopping}</h3>
                    <ExternalLink className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 rounded-full shadow-md">
                      {t.onlinePartner}
                    </span>
                    <span className="text-sm text-green-700 font-bold">ozysa.com</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium leading-relaxed max-w-[250px]">
                    {t.onlineShopDesc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-7 h-7 text-green-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Handmade Products Button */}
          <button 
            onClick={() => setSubView('handmade')}
            className="w-full bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 rounded-[3rem] p-8 text-left shadow-xl shadow-amber-900/10 hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden active:scale-98"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-60"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-amber-50 rounded-full opacity-40"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-3xl shadow-xl shadow-amber-500/40 group-hover:scale-110 transition-transform">
                  <ShoppingBasket className="text-white w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800 mb-2">{t.handmadeProducts}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                      {language === 'bn' ? 'স্থানীয় কারিগর' : 'Local Artisans'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium leading-relaxed max-w-[250px]">
                    {t.handmadeShopDesc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-7 h-7 text-amber-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Handmade sub-view
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-40 animate-in slide-in-from-right duration-500">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 pt-6 pb-5 sticky top-0 z-40 border-b-2 border-amber-200 shadow-sm">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={() => setSubView('selection')} className="p-2 hover:bg-amber-100 rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-amber-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-amber-900 leading-tight">{t.handmadeProducts}</h2>
            <p className="text-xs text-amber-600 mt-1 font-bold">
              {t.villageMadeTag} • {language === 'bn' ? 'খাঁটি গ্রামীণ হস্তশিল্প' : 'Authentic village handicrafts'}
            </p>
          </div>
          <div className="bg-amber-100 p-3 rounded-2xl">
            <Package className="w-7 h-7 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6 max-w-2xl mx-auto">
        <div className="mb-4 px-2">
          <p className="text-sm text-gray-600 font-medium">
            {language === 'bn' ? 'গ্রামের কারিগরদের তৈরি খাঁটি পণ্য' : 'Authentic products made by village artisans'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {handmadeProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-gradient-to-br from-white to-amber-50/30 rounded-[2.8rem] p-4 shadow-lg border-2 border-amber-100 flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 active:scale-95"
            >
              <div className="relative h-48 w-full mb-4 rounded-[2.2rem] overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-full flex items-center space-x-1.5 shadow-xl border-2 border-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
                    {t.villageMadeTag}
                  </span>
                </div>
              </div>

              <div className="px-2 flex-1 flex flex-col">
                <h4 className="text-base font-black text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem] mb-3">
                  {product.name}
                </h4>
                <div className="mt-auto mb-4 flex items-baseline space-x-1 bg-white/60 px-3 py-2 rounded-xl">
                  <span className="text-2xl font-black text-green-600">৳{product.price}</span>
                  <span className="text-xs text-gray-500 font-bold uppercase">{product.unit}</span>
                </div>
                
                <button 
                  onClick={() => handleWhatsAppOrder(product.name)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-green-600/30 active:scale-95 transition-all group/btn"
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 transition-transform group-hover/btn:rotate-12" />
                    <span className="text-xs font-black uppercase tracking-wider">{t.orderOnWhatsapp}</span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
