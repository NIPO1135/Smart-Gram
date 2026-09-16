import React, { useState, useEffect } from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';

const AdminBloodBank: React.FC<AdminSubViewProps> = ({ draft, setDraft, language, labels, onSave, onBack }) => {
  const [backendDonors, setBackendDonors] = useState<any[]>([]);

  useEffect(() => {
    fetchBackendDonors();
  }, []);

  const fetchBackendDonors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/bloodbank/donors`);
      const data = await response.json();
      if (data.status === 'success') {
        setBackendDonors(data.data);
      }
    } catch (error) {
      console.error('Error fetching backend donors:', error);
    }
  };

  const handleDeleteDonor = async (id: string) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/bloodbank/donors/${id}`, { method: 'DELETE' });
      if (response.ok) fetchBackendDonors();
    } catch (error) {
      console.error('Error deleting donor', error);
    }
  };

  const updateRequest = (idx: number, patch: any) => {
    setDraft(prev => {
      const next = { ...prev.blood };
      const requests = [...next.requests];
      requests[idx] = { ...requests[idx], ...patch };
      return { ...prev, blood: { ...next, requests } };
    });
  };

  const addRequest = () => {
    setDraft(prev => {
      const newReq = {
        id: `req_${Date.now()}`,
        enabled: true,
        group: 'A+',
        location: { bn: 'লোকেশন', en: 'Location' },
        hospital: { bn: 'হাসপাতাল', en: 'Hospital' },
        bags: 1,
        dateLabel: { bn: 'আজ', en: 'Today' },
        urgent: true
      };
      return { ...prev, blood: { ...prev.blood, requests: [...prev.blood.requests, newReq] } };
    });
  };

  const removeRequest = (idx: number) => {
    if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) return;
    setDraft(prev => {
      const requests = prev.blood.requests.filter((_, i) => i !== idx);
      return { ...prev, blood: { ...prev.blood, requests } };
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{labels.bloodTitle || 'Blood Bank'}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'রক্তের রিকোয়েস্ট এবং ডোনার মেইনটেইন করুন' : 'Maintain blood requests & donors'}
          </p>
        </div>
      </div>

      {/* Legacy Config - Blood Requests */}
      <div className="mb-10 space-y-4">
         <h4 className="font-black text-gray-800 text-md border-b-[3px] border-red-200 inline-block pb-1">
          {language === 'bn' ? 'জরুরী রক্তের প্রয়োজন (Config)' : 'Emergency Blood Requests (Config)'}
        </h4>
        {draft.blood.requests.map((r, idx) => (
          <div key={r.id} className="border border-red-100 rounded-[2rem] p-5 bg-red-50/40 relative group">
            <button onClick={() => removeRequest(idx)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-md">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{r.id} ({labels.group}: {r.group})</span>
              <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-2xl cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked={r.enabled} onChange={(e) => updateRequest(idx, { enabled: e.target.checked })} className="accent-red-600 w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.hospital} ({labels.bangla})</label>
                  <input value={r.hospital.bn} onChange={(e) => updateRequest(idx, { hospital: { ...r.hospital, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.hospital} ({labels.english})</label>
                  <input value={r.hospital.en} onChange={(e) => updateRequest(idx, { hospital: { ...r.hospital, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.dateLabel} ({labels.bangla})</label>
                  <input value={r.dateLabel.bn} onChange={(e) => updateRequest(idx, { dateLabel: { ...r.dateLabel, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.dateLabel} ({labels.english})</label>
                  <input value={r.dateLabel.en} onChange={(e) => updateRequest(idx, { dateLabel: { ...r.dateLabel, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
                </div>
                <div className="flex items-center gap-2 md:col-start-1 md:col-span-3 bg-white p-3 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer w-full">
                    <input type="checkbox" checked={r.urgent} onChange={(e) => updateRequest(idx, { urgent: e.target.checked })} className="accent-red-600 w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">{labels.urgent} (Urgent)</span>
                  </label>
                </div>
            </div>
          </div>
        ))}
        <button onClick={addRequest} className="w-full border-2 border-dashed border-red-200 py-4 rounded-2xl flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 hover:border-red-400 transition-colors">
          <PlusCircle className="w-5 h-5" />
          {language === 'bn' ? 'নতুন রিকোয়েস্ট যোগ করুন' : 'Add New Request'}
        </button>
      </div>

      {/* Backend Donors */}
      <div className="mt-8 pt-8 border-t-2 border-gray-100">
        <h4 className="font-black text-gray-800 text-md border-b-[3px] border-rose-200 inline-block pb-1 mb-4">
          {language === 'bn' ? 'নতুন রক্তদাতাদের তালিকা (Backend)' : 'Registered Donors (Backend)'}
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {backendDonors.map(d => (
            <div key={d._id} className="flex items-center justify-between border border-rose-100 rounded-[2rem] p-4 bg-rose-50/40 hover:bg-rose-50/80 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-md border border-rose-400/30">
                    {d.blood_group}
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-gray-800">{d.name}</p>
                    <p className="text-[11px] text-gray-500 font-bold tracking-wide mt-0.5">{d.location} &bull; {d.phone}</p>
                  </div>
               </div>
               <button onClick={() => handleDeleteDonor(d._id)} className="p-3 text-red-500 bg-white hover:bg-red-50 hover:-translate-y-0.5 rounded-xl transition-all shadow-sm border border-red-100">
                 <Trash2 className="w-5 h-5" />
               </button>
            </div>
          ))}
          {backendDonors.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-400 font-bold">{language === 'bn' ? 'কোনো রক্তদাতা নেই' : 'No donors found'}</p>
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

export default AdminBloodBank;
