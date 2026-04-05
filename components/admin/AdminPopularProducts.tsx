import React from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { PopularProductConfig, PopularProductIconKey } from '../../context/AppConfigContext';

const POPULAR_ICON_OPTIONS: { key: PopularProductIconKey; label: string }[] = [
  { key: 'Milk', label: 'Milk' },
  { key: 'Egg', label: 'Egg' },
  { key: 'Fish', label: 'Fish' },
  { key: 'Meat', label: 'Meat' },
];

const AdminPopularProducts: React.FC<AdminSubViewProps> = ({ draft, setDraft, language, labels, onSave, onBack }) => {
  const updateProduct = (idx: number, patch: Partial<PopularProductConfig>) => {
    setDraft(prev => {
      const next = [...prev.popularProducts];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, popularProducts: next };
    });
  };

  const addProduct = () => {
    setDraft(prev => {
      const newProduct: PopularProductConfig = {
        id: `pop_${Date.now()}`,
        enabled: true,
        name: { bn: 'নতুন পণ্য', en: 'New Product' },
        iconKey: 'Milk',
        color: 'bg-blue-100 text-blue-600',
        price: '0',
        unit: { bn: 'কেজি', en: 'kg' }
      };
      return { ...prev, popularProducts: [...prev.popularProducts, newProduct] };
    });
  };

  const removeProduct = (idx: number) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) return;
    setDraft(prev => {
      const next = prev.popularProducts.filter((_, i) => i !== idx);
      return { ...prev, popularProducts: next };
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{labels.popularTitle || 'Popular Products'}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'হোম পেজের পপুলার প্রোডাক্ট কার্ড মেইনটেইন করুন' : 'Edit popular products on home screen'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {draft.popularProducts.map((p, idx) => (
          <div key={p.id} className="border border-blue-100 rounded-[2rem] p-5 bg-blue-50/30 relative group hover:bg-blue-50/50 transition-colors">
            <button onClick={() => removeProduct(idx)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-md">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{p.id}</span>
              <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl cursor-pointer">
                <input type="checkbox" checked={p.enabled} onChange={(e) => updateProduct(idx, { enabled: e.target.checked })} className="accent-blue-600 w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.name} ({labels.bangla})</label>
                <input value={p.name.bn} onChange={(e) => updateProduct(idx, { name: { ...p.name, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.name} ({labels.english})</label>
                <input value={p.name.en} onChange={(e) => updateProduct(idx, { name: { ...p.name, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.price}</label>
                <input type="number" value={p.price} onChange={(e) => updateProduct(idx, { price: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.unit} ({labels.bangla})</label>
                <input value={p.unit.bn} onChange={(e) => updateProduct(idx, { unit: { ...p.unit, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.unit} ({labels.english})</label>
                <input value={p.unit.en} onChange={(e) => updateProduct(idx, { unit: { ...p.unit, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.icon}</label>
                <select value={p.iconKey} onChange={(e) => updateProduct(idx, { iconKey: e.target.value as PopularProductIconKey })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold">
                  {POPULAR_ICON_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={addProduct} className="w-full border-2 border-dashed border-blue-200 py-4 rounded-2xl flex items-center justify-center gap-2 text-blue-500 font-bold hover:bg-blue-50 hover:border-blue-400 transition-colors">
          <PlusCircle className="w-5 h-5" />
          {language === 'bn' ? 'নতুন পপুলার পণ্য যোগ করুন' : 'Add New Popular Product'}
        </button>
      </div>

      <button onClick={onSave} className="mt-8 w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-xl shadow-green-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
};

export default AdminPopularProducts;
