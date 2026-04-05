import React from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { EmergencyCategoryConfig } from '../../context/AppConfigContext';

const AdminEmergency: React.FC<AdminSubViewProps> = ({ draft, setDraft, language, labels, t, onSave, onBack }) => {
  const updateCategory = (idx: number, patch: Partial<EmergencyCategoryConfig>) => {
    setDraft(prev => {
      const nextCats = [...prev.emergencyCategories];
      nextCats[idx] = { ...nextCats[idx], ...patch };
      return { ...prev, emergencyCategories: nextCats };
    });
  };

  const updateContact = (catIdx: number, contactIdx: number, patch: any) => {
    setDraft(prev => {
      const nextCats = [...prev.emergencyCategories];
      const nextContacts = [...nextCats[catIdx].contacts];
      nextContacts[contactIdx] = { ...nextContacts[contactIdx], ...patch };
      nextCats[catIdx] = { ...nextCats[catIdx], contacts: nextContacts };
      return { ...prev, emergencyCategories: nextCats };
    });
  };

  const addContact = (catIdx: number) => {
    setDraft(prev => {
      const nextCats = [...prev.emergencyCategories];
      const newContact = {
        id: `contact_${Date.now()}`,
        name: { bn: 'নতুন কন্টাক্ট', en: 'New Contact' },
        description: { bn: 'বিবরণ', en: 'Description' },
        phone: '01XXXXXXXXX'
      };
      nextCats[catIdx] = { ...nextCats[catIdx], contacts: [...nextCats[catIdx].contacts, newContact] };
      return { ...prev, emergencyCategories: nextCats };
    });
  };

  const removeContact = (catIdx: number, contactIdx: number) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) return;
    setDraft(prev => {
      const nextCats = [...prev.emergencyCategories];
      const nextContacts = nextCats[catIdx].contacts.filter((_, i) => i !== contactIdx);
      nextCats[catIdx] = { ...nextCats[catIdx], contacts: nextContacts };
      return { ...prev, emergencyCategories: nextCats };
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{labels.emergencyTitle || 'Emergency'}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'ইমার্জেন্সি নম্বর অ্যাড/রিমুভ করুন' : 'Add/Remove emergency contacts'}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {draft.emergencyCategories.map((cat, catIdx) => {
          const catTitleKey = cat.id === 'ambulance' ? 'ambulance' : cat.id === 'fire' ? 'fireService' : cat.id === 'police' ? 'police' : 'hospital';
          const defaultTitle = (t as any)[catTitleKey] || cat.id;

          return (
            <div key={cat.id} className="border-t-2 border-gray-100 pt-6 first:border-0 first:pt-0">
              <div className="flex justify-between items-center mb-4 border border-gray-100 p-4 rounded-[2rem] bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-white font-black shadow-lg`}>
                    {cat.iconKey.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800">{defaultTitle}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{cat.id}</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input type="checkbox" checked={cat.enabled} onChange={(e) => updateCategory(catIdx, { enabled: e.target.checked })} className="accent-red-500 w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
                </label>
              </div>

              <div className="space-y-4 pl-4 border-l-2 border-red-50 ml-4">
                {cat.contacts.map((contact, contactIdx) => (
                  <div key={contact.id} className="border border-gray-100 rounded-[2rem] p-4 bg-white relative group">
                    <button onClick={() => removeContact(catIdx, contactIdx)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-md">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.name} ({labels.bangla})</label>
                        <input value={contact.name.bn} onChange={(e) => updateContact(catIdx, contactIdx, { name: { ...contact.name, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.name} ({labels.english})</label>
                        <input value={contact.name.en} onChange={(e) => updateContact(catIdx, contactIdx, { name: { ...contact.name, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.description} ({labels.bangla})</label>
                        <input value={contact.description.bn} onChange={(e) => updateContact(catIdx, contactIdx, { description: { ...contact.description, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.description} ({labels.english})</label>
                        <input value={contact.description.en} onChange={(e) => updateContact(catIdx, contactIdx, { description: { ...contact.description, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.phone}</label>
                        <input value={contact.phone} onChange={(e) => updateContact(catIdx, contactIdx, { phone: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold" />
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => addContact(catIdx)} className="w-full border-2 border-dashed border-gray-200 py-3 rounded-2xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:bg-gray-50 hover:text-green-600 hover:border-green-300 transition-colors text-sm">
                  <PlusCircle className="w-5 h-5" />
                  {language === 'bn' ? 'নতুন কন্টাক্ট যোগ করুন' : 'Add New Contact'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onSave} className="mt-8 w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-xl shadow-green-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
};

export default AdminEmergency;
