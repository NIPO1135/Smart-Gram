import React, { useState, useEffect } from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { HandmadeProductConfig } from '../../context/AppConfigContext';

const AdminVillageMarket: React.FC<AdminSubViewProps> = ({ draft, setDraft, language, labels, onSave, onBack }) => {
  const [backendProducts, setBackendProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchBackendProducts();
  }, []);

  const fetchBackendProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/market/products');
      const data = await response.json();
      if (data.status === 'success') {
        setBackendProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching backend products:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/market/products/${id}`, { method: 'DELETE' });
      if (response.ok) fetchBackendProducts();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const updateHandmade = (idx: number, patch: Partial<HandmadeProductConfig>) => {
    setDraft(prev => {
      const next = [...prev.handmadeProducts];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, handmadeProducts: next };
    });
  };

  const addHandmade = () => {
    setDraft(prev => {
      const newProduct: HandmadeProductConfig = {
        id: `handmade_${Date.now()}`,
        enabled: true,
        name: { bn: 'নতুন পণ্য', en: 'New Product' },
        price: 0,
        unit: { bn: 'কেজি', en: 'kg' },
        image: ''
      };
      return { ...prev, handmadeProducts: [...prev.handmadeProducts, newProduct] };
    });
  };

  const removeHandmade = (idx: number) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) return;
    setDraft(prev => {
      const next = prev.handmadeProducts.filter((_, i) => i !== idx);
      return { ...prev, handmadeProducts: next };
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{labels.handmadeTitle || 'Village Market'}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'হস্তশিল্প এবং ইউজারদের পণ্য মেইনটেইন করুন' : 'Maintain handmade & user products'}
          </p>
        </div>
      </div>

      {/* Config Products */}
      <div className="mb-10 space-y-4">
        <h4 className="font-black text-gray-800 text-md border-b-[3px] border-amber-200 inline-block pb-1">
          {language === 'bn' ? 'অ্যাডমিন নিয়ন্ত্রিত হস্তশিল্প (Config)' : 'Admin Configured Handmade Products'}
        </h4>
        
        {draft.handmadeProducts.map((p, idx) => (
          <div key={p.id} className="border border-amber-100 rounded-[2rem] p-5 bg-amber-50/30 relative group">
            <button onClick={() => removeHandmade(idx)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-md">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{p.id}</span>
              <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-2xl cursor-pointer">
                <input type="checkbox" checked={p.enabled} onChange={(e) => updateHandmade(idx, { enabled: e.target.checked })} className="accent-amber-600 w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.name} ({labels.bangla})</label>
                <input value={p.name.bn} onChange={(e) => updateHandmade(idx, { name: { ...p.name, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.name} ({labels.english})</label>
                <input value={p.name.en} onChange={(e) => updateHandmade(idx, { name: { ...p.name, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.price}</label>
                <input type="number" value={p.price} onChange={(e) => updateHandmade(idx, { price: Number(e.target.value) || 0 })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.unit} ({labels.bangla})</label>
                <input value={p.unit.bn} onChange={(e) => updateHandmade(idx, { unit: { ...p.unit, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.unit} ({labels.english})</label>
                <input value={p.unit.en} onChange={(e) => updateHandmade(idx, { unit: { ...p.unit, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
               <div className="md:col-span-2">
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Image URL</label>
                <input value={p.image} onChange={(e) => updateHandmade(idx, { image: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
            </div>
          </div>
        ))}
        <button onClick={addHandmade} className="w-full border-2 border-dashed border-amber-200 py-4 rounded-2xl flex items-center justify-center gap-2 text-amber-500 font-bold hover:bg-amber-50 hover:border-amber-400 transition-colors">
          <PlusCircle className="w-5 h-5" />
          {language === 'bn' ? 'নতুন পণ্য যোগ করুন' : 'Add New Product'}
        </button>
      </div>

      {/* Backend Products */}
      <div className="mt-8 pt-8 border-t-2 border-gray-100">
        <h4 className="font-black text-gray-800 text-md border-b-[3px] border-emerald-200 inline-block pb-1 mb-4">
          {language === 'bn' ? 'ইউজারদের আপলোড করা পণ্য (Backend)' : 'User Uploaded Products (Backend)'}
        </h4>
        <div className="space-y-3">
          {backendProducts.map(p => (
            <div key={p._id} className="flex items-center justify-between border border-emerald-100 rounded-[2rem] p-4 bg-emerald-50/30 hover:bg-emerald-50 transition-colors">
               <div className="flex items-center gap-4">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse" />
                  )}
                  <div>
                    <p className="text-[15px] font-black text-gray-800">{p.name}</p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">৳{p.price}/{p.unit} &bull; {p.contact}</p>
                  </div>
               </div>
               <button onClick={() => handleDeleteProduct(p._id)} className="p-3 text-red-500 bg-white hover:bg-red-50 hover:-translate-y-0.5 rounded-xl transition-all shadow-sm border border-red-100">
                 <Trash2 className="w-5 h-5" />
               </button>
            </div>
          ))}
          {backendProducts.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-400 font-bold">{language === 'bn' ? 'কোনো পণ্য নেই' : 'No backend products found'}</p>
            </div>
          )}
        </div>
      </div>

      <button onClick={onSave} className="mt-10 w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-xl shadow-green-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
};

export default AdminVillageMarket;
