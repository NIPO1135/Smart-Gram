import React, { useState } from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { PopularProductConfig } from '../../context/AppConfigContext';

const AdminPopularProducts: React.FC<AdminSubViewProps> = ({ draft, setDraft, language, labels, onSave, onBack }) => {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const updateProduct = (idx: number, patch: Partial<PopularProductConfig>) => {
    setDraft(prev => {
      const next = [...prev.popularProducts];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, popularProducts: next };
    });
  };

  const handleImageUpload = async (idx: number, file: File) => {
    try {
      setUploadingId(draft.popularProducts[idx].id);
      const rawSession = localStorage.getItem('auth_session');
      const token = rawSession ? JSON.parse(rawSession)?.token : null;
      if (!token) {
        window.alert(language === 'bn' ? 'লগইন সেশন পাওয়া যায়নি। আবার লগইন করুন।' : 'Missing login session. Please login again.');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/uploads/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data?.imageUrl) {
        throw new Error(data?.message || 'Upload failed');
      }

      updateProduct(idx, { image: data.imageUrl });
    } catch (error) {
      console.error(error);
      window.alert(language === 'bn' ? 'ছবি আপলোড করা যায়নি।' : 'Image upload failed.');
    } finally {
      setUploadingId(null);
    }
  };

  const addProduct = () => {
    setDraft(prev => {
      const newProduct: PopularProductConfig = {
        id: `pop_${Date.now()}`,
        enabled: true,
        name: { bn: 'নতুন পণ্য', en: 'New Product' },
        iconKey: 'Milk',
        image: '',
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
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                  {language === 'bn' ? 'ছবির লিংক' : 'Image URL'}
                </label>
                <input
                  value={p.image ?? ''}
                  onChange={(e) => updateProduct(idx, { image: e.target.value })}
                  placeholder={language === 'bn' ? 'https://example.com/product.jpg' : 'https://example.com/product.jpg'}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold"
                />
                <label className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wide cursor-pointer hover:bg-blue-100 transition-colors">
                  <PlusCircle className="w-4 h-4" />
                  {uploadingId === p.id
                    ? (language === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...')
                    : (language === 'bn' ? 'ডাইরেক্ট ছবি আপলোড' : 'Upload Picture')}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(idx, file);
                      }
                      e.currentTarget.value = '';
                    }}
                  />
                </label>
                {!!p.image && <img src={p.image} alt={p.name.en || p.name.bn} className="mt-2 w-full h-24 object-cover rounded-xl border border-gray-200" />}
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
