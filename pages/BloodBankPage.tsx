
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  Heart
} from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  group: string;
  location: string;
  lastDonation: string;
  phone: string;
}

interface Request {
  id: string;
  group: string;
  location: string;
  hospital: string;
  bags: number;
  date: string;
  urgent: boolean;
}

const BloodBankPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [activeGroup, setActiveGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    // Pick a random slogan index on mount
    setSloganIndex(Math.floor(Math.random() * 3));
  }, []);

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const slogans = [t.slogan1, t.slogan2, t.slogan3];

  const mockDonors: Donor[] = [
    { id: '1', name: language === 'bn' ? 'আরিফ আহমেদ' : 'Arif Ahmed', group: 'O+', location: language === 'bn' ? 'দক্ষিণ গ্রাম' : 'South Village', lastDonation: '12-10-2023', phone: '01711111111' },
    { id: '2', name: language === 'bn' ? 'সোহেল রানা' : 'Sohel Rana', group: 'A+', location: language === 'bn' ? 'উত্তর পাড়া' : 'North Para', lastDonation: '05-01-2024', phone: '01722222222' },
    { id: '3', name: language === 'bn' ? 'কামাল উদ্দিন' : 'Kamal Uddin', group: 'B+', location: language === 'bn' ? 'পূর্ব গ্রাম' : 'East Village', lastDonation: '15-02-2024', phone: '01733333333' },
    { id: '4', name: language === 'bn' ? 'রিনা আক্তার' : 'Rina Akter', group: 'O+', location: language === 'bn' ? 'সদর বাজার' : 'Sadar Bazar', lastDonation: '20-12-2023', phone: '01744444444' },
  ];

  const mockRequests: Request[] = [
    { 
      id: 'r1', 
      group: 'B-', 
      location: language === 'bn' ? 'গ্রাম হাসপাতাল' : 'Village Hospital', 
      hospital: language === 'bn' ? 'উপজেলা স্বাস্থ্য কমপ্লেক্স' : 'Upazila Health Complex', 
      bags: 2, 
      date: 'Today', 
      urgent: true 
    },
    { 
      id: 'r2', 
      group: 'O+', 
      location: language === 'bn' ? 'পূর্ব গ্রাম' : 'East Village', 
      hospital: language === 'bn' ? 'ক্লিনিক রোড' : 'Clinic Road', 
      bags: 1, 
      date: 'Tomorrow', 
      urgent: false 
    },
  ];

  const filteredDonors = mockDonors.filter(donor => {
    const matchesGroup = activeGroup === 'All' || donor.group === activeGroup;
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          donor.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setIsRegModalOpen(false);
    }, 2000);
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

        {/* Emergency Requests Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-lg font-black text-red-600 flex items-center mb-1">
                <AlertCircle className="w-5 h-5 mr-2" />
                {t.emergencyReq}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'bn' ? 'জরুরীভাবে রক্তের প্রয়োজন' : 'Urgent blood needed'}
              </p>
            </div>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar snap-x">
            {mockRequests.map((req) => (
              <div key={req.id} className={`flex-shrink-0 w-80 bg-gradient-to-br ${req.urgent ? 'from-red-50 to-rose-100' : 'from-white to-red-50'} border-2 ${req.urgent ? 'border-red-300' : 'border-red-100'} rounded-[2.5rem] p-6 snap-start relative overflow-hidden shadow-lg hover:shadow-xl transition-all`}>
                {req.urgent && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2 rounded-bl-3xl text-xs font-black uppercase tracking-wider shadow-lg animate-pulse">
                    ⚠️ {t.urgent}
                  </div>
                )}
                <div className="flex items-center justify-between mb-5">
                  <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white p-4 rounded-2xl font-black text-xl shadow-lg">
                    {req.group}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-tight mb-1">{t.bagsNeeded}</p>
                    <p className="text-2xl font-black text-red-600 leading-none">{req.bags} {language === 'bn' ? 'ব্যাগ' : 'Bags'}</p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-start text-sm text-gray-700 font-bold bg-white/60 p-3 rounded-xl">
                    <MapPin className="w-4 h-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{language === 'bn' ? 'হাসপাতাল:' : 'Hospital:'}</p>
                      <p>{req.hospital}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray-700 font-bold bg-white/60 p-3 rounded-xl">
                    <Calendar className="w-4 h-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{t.dateNeeded}:</p>
                      <p>{req.date === 'Today' ? (language === 'bn' ? 'আজ' : 'Today') : req.date === 'Tomorrow' ? (language === 'bn' ? 'আগামীকাল' : 'Tomorrow') : req.date}</p>
                    </div>
                  </div>
                </div>
                <button className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
                  req.urgent 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700' 
                    : 'bg-white border-2 border-red-200 text-red-600 hover:bg-red-50'
                }`}>
                  {t.callNow}
                </button>
              </div>
            ))}
          </div>
        </section>

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
                  onClick={() => setActiveGroup(group)}
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
            {filteredDonors.map((donor) => (
              <div 
                key={donor.id}
                className="bg-gradient-to-br from-white to-red-50/50 border-2 border-red-100 rounded-[2.5rem] p-6 shadow-md hover:shadow-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-5 flex-1">
                  <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white w-16 h-16 rounded-3xl flex items-center justify-center font-black text-xl shadow-xl shadow-red-600/30 group-hover:scale-110 transition-transform">
                    {donor.group}
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
                        <span>{language === 'bn' ? 'সর্বশেষ:' : 'Last:'} {donor.lastDonation}</span>
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
            ))}
            {filteredDonors.length === 0 && (
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                        <Droplet className="w-3 h-3 mr-1 text-red-500" />
                        {t.bloodGroup}
                      </label>
                      <select className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-red-500/20 focus:border-red-400 transition-all outline-none shadow-sm">
                        {bloodGroups.filter(g => g !== 'All').map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-red-500" />
                        {t.phone}
                      </label>
                      <input type="tel" className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 shadow-sm" placeholder={language === 'bn' ? '০১৭XXXXXXXX' : '017XXXXXXXX'} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-red-500" />
                      {t.location}
                    </label>
                    <input type="text" className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 shadow-sm" placeholder={language === 'bn' ? 'গ্রামের নাম লিখুন' : 'Enter village name'} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 ml-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-red-500" />
                      {t.lastDonation}
                    </label>
                    <input type="date" className="w-full p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 shadow-sm" required />
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-5 rounded-3xl font-black uppercase tracking-wider shadow-xl shadow-red-600/30 active:scale-95 transition-all mt-6 hover:from-red-700 hover:to-rose-700">
                    {t.submit}
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
