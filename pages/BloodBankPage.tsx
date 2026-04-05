import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppConfig } from '../context/AppConfigContext';
import { 
  Droplet, 
  Phone, 
  Search, 
  ArrowLeft, 
  PlusCircle, 
  MapPin, 
  Calendar,
  X,
  AlertCircle,
  CheckCircle2,
  Users,
  Heart,
  User
} from 'lucide-react';

interface Donor {
  id: string;
  name?: string;
  blood_group?: string;
  group?: string;
  location: string;
  last_donation?: string;
  lastDonation?: string;
  phone: string;
  image?: string;
}

const BloodBankPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const { config } = useAppConfig();
  const [activeGroup, setActiveGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api/bloodbank';

  useEffect(() => {
    setSloganIndex(Math.floor(Math.random() * 3));
    fetchDonors('All');
  }, []);

  const fetchDonors = async (group: string) => {
    setLoading(true);
    try {
      const url = group === 'All' 
        ? `${API_BASE_URL}/donors`
        : `${API_BASE_URL}/donors?bloodGroup=${group}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        setDonors(data.data);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const slogans = config.blood.slogans.map(s => (language === 'bn' ? s.bn : s.en));

  const filteredDonors = donors.filter(donor => {
    const matchesGroup = activeGroup === 'All' || donor.blood_group === activeGroup;
    const matchesSearch = donor.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleGroupChange = (group: string) => {
    setActiveGroup(group);
    fetchDonors(group);
  };

  const handleRegisterDonor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        setRegSuccess(true);
        setTimeout(() => {
          setRegSuccess(false);
          setIsRegModalOpen(false);
          fetchDonors(activeGroup);
        }, 2000);
      } else {
        setRegError(data.message || 'Registration failed');
      }
    } catch (error) {
      setRegError('Network error. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-44 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 px-4 pt-6 pb-5 sticky top-0 z-40 border-b-2 border-red-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="p-2 hover:bg-red-100 rounded-full transition-colors active:scale-95">
              <ArrowLeft className="w-6 h-6 text-red-600" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-red-900 leading-tight">{t.bloodTitle}</h2>
              <p className="text-xs text-red-600 mt-1">
                {language === 'bn' ? 'রক্তদাতা খুঁজুন এবং জীবন বাঁচান' : 'Find donors and save lives'}
              </p>
            </div>
          </div>
          <div className="bg-red-100 p-3 rounded-2xl">
            <Droplet className="w-7 h-7 text-red-600 fill-current" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Inspiring Slogan Section */}
        <div className="bg-gradient-to-br from-red-500 via-rose-600 to-red-600 rounded-[2.5rem] p-8 shadow-2xl shadow-red-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/15 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-28 h-28 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex items-center space-x-5">
            <div className="bg-white/25 p-5 rounded-[2rem] backdrop-blur-md border-2 border-white/30 shadow-lg">
              <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white/90 uppercase tracking-wider mb-2">
                {language === 'bn' ? '💝 অনুপ্রেরণা' : '💝 Inspiration'}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                "{slogans[sloganIndex]}"
              </h3>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <section className="space-y-6">
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 px-2">
              {language === 'bn' ? 'রক্তদাতা খুঁজুন' : 'Find Blood Donors'}
            </p>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-4 py-5 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-red-500/20 focus:border-red-300 outline-none text-sm font-bold transition-all shadow-sm"
                placeholder={t.searchDonor}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 px-2">
              {language === 'bn' ? 'রক্তের গ্রুপ নির্বাচন করুন' : 'Select Blood Group'}
            </p>
            <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => handleGroupChange(group)}
                  className={`px-7 py-3.5 rounded-full whitespace-nowrap text-sm font-black uppercase tracking-wider transition-all active:scale-95 ${
                    activeGroup === group 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xl shadow-red-600/30 scale-105' 
                    : 'bg-white border-2 border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                  }`}
                >
                  {group === 'All' ? t.allGroups : group}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Donor List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-lg font-black text-gray-800 flex items-center mb-1">
                <Users className="w-5 h-5 mr-2 text-red-600" />
                {language === 'bn' ? 'উপলব্ধ রক্তদাতা' : 'Available Donors'}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'bn' ? 'রক্তদাতাদের সাথে সরাসরি যোগাযোগ করুন' : 'Contact donors directly'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 font-bold">{language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
              </div>
            ) : filteredDonors.length > 0 ? (
              filteredDonors.map((donor) => (
                <div 
                  key={donor.id}
                  className="bg-gradient-to-br from-white to-red-50/50 border-2 border-red-100 rounded-[2.5rem] p-6 shadow-md hover:shadow-xl transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-5 flex-1">
                    <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center font-black text-xl shadow-xl shadow-red-600/30 group-hover:scale-110 transition-transform overflow-hidden relative">
                      {donor.image ? (
                        <img src={donor.image} alt={donor.name} className="w-full h-full object-cover" />
                      ) : (
                        donor.blood_group
                      )}
                      {donor.image && (
                         <div className="absolute bottom-0 right-0 bg-red-600/90 backdrop-blur-sm text-[10px] font-black px-2 py-0.5 rounded-tl-lg">
                           {donor.blood_group}
                         </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-800 text-lg leading-none mb-2">{donor.name}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-gray-600">
                        <div className="flex items-center text-xs font-bold bg-white/80 px-3 py-1.5 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                          <span>{donor.location}</span>
                        </div>
                        <div className="flex items-center text-xs font-bold bg-white/80 px-3 py-1.5 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                          <span>{language === 'bn' ? 'সর্বশেষ:' : 'Last:'} {donor.last_donation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={`tel:${donor.phone}`}
                    className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all active:scale-90 shadow-lg ml-4"
                    title={language === 'bn' ? 'কল করুন' : 'Call Now'}
                  >
                    <Phone className="w-6 h-6" />
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="bg-red-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Droplet className="w-12 h-12 text-red-300" />
                </div>
                <p className="font-black text-gray-600 text-base mb-2">
                  {language === 'bn' ? 'কোন রক্তদাতা পাওয়া যায়নি' : 'No donors found'}
                </p>
                <p className="text-sm text-gray-400">
                  {language === 'bn' ? 'অন্যান্য রক্তের গ্রুপ দেখুন' : 'Try other blood groups'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsRegModalOpen(true)}
          className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-10 py-5 rounded-full flex items-center space-x-3 shadow-2xl shadow-red-600/50 hover:scale-110 active:scale-95 transition-all border-4 border-white hover:from-red-700 hover:to-rose-700"
        >
          <div className="bg-white/20 p-2 rounded-full">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-sm font-black uppercase tracking-wider">{t.becomeDonor}</span>
        </button>
      </div>

      {/* Registration Modal */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsRegModalOpen(false)}></div>
          <div className="bg-gradient-to-br from-white to-red-50/30 w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-500 border-t-4 border-red-500">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight mb-1">{t.donorRegTitle}</h3>
                  <p className="text-xs text-gray-500">
                    {language === 'bn' ? 'রক্তদাতা হিসেবে নিবন্ধন করুন এবং জীবন বাঁচান' : 'Register as donor and save lives'}
                  </p>
                </div>
                <button onClick={() => setIsRegModalOpen(false)} className="p-2 hover:bg-red-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {regSuccess ? (
                <div className="text-center py-12 animate-in zoom-in">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-800 mb-2">{t.successReg}</h4>
                  <p className="text-sm text-gray-500">
                    {language === 'bn' ? 'আপনার তথ্য সংরক্ষণ করা হয়েছে' : 'Your information has been saved'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterDonor} className="space-y-5">
                  {regError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-700 text-sm">{regError}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                        <User className="w-3 h-3 mr-1 text-red-500" />
                        {language === 'bn' ? 'রক্তদাতার নাম' : 'Donor Name'}
                      </label>
                      <input name="name" type="text" className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 shadow-sm" placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                        <User className="w-3 h-3 mr-1 text-red-500" />
                        {language === 'bn' ? 'ছবি (ঐচ্ছিক)' : 'Photo (Optional)'}
                      </label>
                      <input name="image" type="file" accept="image/*" className="w-full p-3 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 shadow-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                        <Droplet className="w-3 h-3 mr-1 text-red-500" />
                        {t.bloodGroup}
                      </label>
                      <select name="bloodGroup" className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-red-500/20 focus:border-red-400 transition-all outline-none shadow-sm" required>
                        <option value="">Select</option>
                        {bloodGroups.filter(g => g !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-red-500" />
                        {t.phone}
                      </label>
                      <input name="phone" type="tel" className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 shadow-sm" placeholder={language === 'bn' ? '০১৭XXXXXXXX' : '017XXXXXXXX'} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-red-500" />
                      {t.location}
                    </label>
                    <input name="location" type="text" className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 shadow-sm" placeholder={language === 'bn' ? 'গ্রামের নাম লিখুন' : 'Enter village name'} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-red-500" />
                      {t.lastDonation}
                    </label>
                    <input name="lastDonation" type="date" className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 shadow-sm" required />
                  </div>
                  <button type="submit" disabled={regLoading} className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-5 rounded-3xl font-black uppercase tracking-wider shadow-xl shadow-red-600/30 active:scale-95 transition-all mt-6 hover:from-red-700 hover:to-rose-700 disabled:opacity-50">
                    {regLoading ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : t.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default BloodBankPage;
