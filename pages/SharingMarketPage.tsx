
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  ShoppingBag,
  Search,
  Plus,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle2,
  X,
  Car,
  HardHat,
  FileText
} from 'lucide-react';

type TabType = 'rideShare' | 'findLabor' | 'landBuySell';

interface Ad {
  id: string;
  title: string;
  description: string;
  owner: string;
  location: string;
  contact: string;
  price?: string;
  time: string;
}

const SharingMarketPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('rideShare');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    location: '',
    contact: '',
    price: ''
  });

  const [rideShareAds, setRideShareAds] = useState<Ad[]>([
    {
      id: '1',
      title: language === 'bn' ? 'ঢাকা থেকে চট্টগ্রাম' : 'Dhaka to Chittagong',
      description: language === 'bn' ? 'আজ সন্ধ্যায় ঢাকা থেকে চট্টগ্রাম যাচ্ছি, শেয়ার করতে চাই' : 'Going to Chittagong from Dhaka this evening, looking to share ride',
      owner: 'Karim Ali',
      location: 'Dhaka',
      contact: '01712345678',
      price: language === 'bn' ? '৫০০ টাকা' : '500 BDT',
      time: '2h ago'
    }
  ]);

  const [laborAds, setLaborAds] = useState<Ad[]>([
    {
      id: '1',
      title: language === 'bn' ? 'বাড়ি নির্মাণের শ্রমিক প্রয়োজন' : 'Need construction workers',
      description: language === 'bn' ? 'বাড়ি নির্মাণের জন্য অভিজ্ঞ শ্রমিক প্রয়োজন' : 'Need experienced workers for house construction',
      owner: 'Rahim Uddin',
      location: 'North Bazaar',
      contact: '01712345679',
      price: language === 'bn' ? '১০০০ টাকা/দিন' : '1000 BDT/day',
      time: '5h ago'
    }
  ]);

  const [landAds, setLandAds] = useState<Ad[]>([
    {
      id: '1',
      title: language === 'bn' ? '৩ কাঠা জমি বিক্রয়' : '3 Katha land for sale',
      description: language === 'bn' ? 'মূল রাস্তার পাশে ৩ কাঠা জমি বিক্রয় করা হবে' : '3 Katha land for sale beside main road',
      owner: 'Fatema Begum',
      location: 'School Road',
      contact: '01712345680',
      price: language === 'bn' ? '১৫ লক্ষ টাকা' : '15 Lakh BDT',
      time: '1 day ago'
    }
  ]);

  const getCurrentAds = () => {
    switch(activeTab) {
      case 'rideShare': return rideShareAds;
      case 'findLabor': return laborAds;
      case 'landBuySell': return landAds;
    }
  };

  const setCurrentAds = (ads: Ad[]) => {
    switch(activeTab) {
      case 'rideShare': setRideShareAds(ads); break;
      case 'findLabor': setLaborAds(ads); break;
      case 'landBuySell': setLandAds(ads); break;
    }
  };

  const filteredAds = getCurrentAds().filter(ad => 
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAd = () => {
    if (newAd.title.trim() && newAd.description.trim() && newAd.location.trim() && newAd.contact.trim()) {
      const ad: Ad = {
        id: Date.now().toString(),
        title: newAd.title,
        description: newAd.description,
        owner: user?.name || 'Anonymous',
        location: newAd.location,
        contact: newAd.contact,
        price: newAd.price || undefined,
        time: 'Just now'
      };
      const currentAds = getCurrentAds();
      setCurrentAds([ad, ...currentAds]);
      setNewAd({ title: '', description: '', location: '', contact: '', price: '' });
      setShowAddModal(false);
    }
  };

  const handleContact = (ad: Ad) => {
    const message = language === 'bn' 
      ? `হ্যালো ${ad.owner}, আমি আপনার ${ad.title} সম্পর্কে জানতে চাই।`
      : `Hello ${ad.owner}, I'm interested in ${ad.title}.`;
    window.open(`https://wa.me/${ad.contact}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const tabs = [
    {
      id: 'rideShare' as TabType,
      label: t.rideShare,
      icon: Car
    },
    {
      id: 'findLabor' as TabType,
      label: t.findLabor,
      icon: HardHat
    },
    {
      id: 'landBuySell' as TabType,
      label: t.landBuySell,
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-44">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 pt-8 pb-20 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-white text-3xl font-black mb-2">{t.sharingMarket}</h1>
          <p className="text-orange-100 text-sm font-bold">{t.sharingMarketDesc}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
        {/* Tab Buttons */}
        <div className="bg-white rounded-[2rem] p-3 shadow-xl border border-orange-50 mb-6 flex gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-200'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className={`text-xs font-black ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar with Add Button */}
        <div className="bg-white rounded-[2rem] p-4 shadow-xl border border-orange-50 mb-6 flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'খুঁজুন...' : 'Search...'}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 p-3 rounded-xl text-white hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-black hidden sm:inline">{t.postAd}</span>
          </button>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAds.length === 0 ? (
            <div className="col-span-2 bg-white rounded-[2rem] p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">
                {language === 'bn' ? 'কোনো বিজ্ঞাপন পাওয়া যায়নি' : 'No ads found'}
              </p>
            </div>
          ) : (
            filteredAds.map((ad) => (
              <div key={ad.id} className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-800 text-lg mb-2">{ad.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{ad.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold">{ad.owner}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold">{ad.location}</span>
                  </div>
                  {ad.price && (
                    <div className="flex items-center space-x-2 text-orange-600">
                      <span className="text-sm font-black">{ad.price}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold">{ad.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleContact(ad)}
                  className="w-full bg-orange-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-md shadow-orange-600/20 flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{language === 'bn' ? 'যোগাযোগ করুন' : 'Contact'}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Ad Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setShowAddModal(false)}
          ></div>
          
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-50">
              <span className="font-black text-gray-800 text-lg">
                {t.postAd}
              </span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>

            <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {language === 'bn' ? 'শিরোনাম' : 'Title'}
                </label>
                <input
                  type="text"
                  value={newAd.title}
                  onChange={(e) => setNewAd({...newAd, title: e.target.value})}
                  placeholder={
                    activeTab === 'rideShare' 
                      ? (language === 'bn' ? 'যেমন: ঢাকা থেকে চট্টগ্রাম' : 'e.g., Dhaka to Chittagong')
                      : activeTab === 'findLabor'
                      ? (language === 'bn' ? 'যেমন: শ্রমিক প্রয়োজন' : 'e.g., Need workers')
                      : (language === 'bn' ? 'যেমন: জমি বিক্রয়' : 'e.g., Land for sale')
                  }
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {language === 'bn' ? 'বর্ণনা' : 'Description'}
                </label>
                <textarea
                  value={newAd.description}
                  onChange={(e) => setNewAd({...newAd, description: e.target.value})}
                  placeholder={language === 'bn' ? 'বিস্তারিত বর্ণনা...' : 'Detailed description...'}
                  rows={3}
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none resize-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {t.location}
                </label>
                <input
                  type="text"
                  value={newAd.location}
                  onChange={(e) => setNewAd({...newAd, location: e.target.value})}
                  placeholder={language === 'bn' ? 'অবস্থান' : 'Location'}
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {language === 'bn' ? 'যোগাযোগ নম্বর' : 'Contact Number'}
                </label>
                <input
                  type="tel"
                  value={newAd.contact}
                  onChange={(e) => setNewAd({...newAd, contact: e.target.value})}
                  placeholder={language === 'bn' ? '০১৭১২৩৪৫৬৭৮' : '01712345678'}
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {language === 'bn' ? 'মূল্য (ঐচ্ছিক)' : 'Price (Optional)'}
                </label>
                <input
                  type="text"
                  value={newAd.price}
                  onChange={(e) => setNewAd({...newAd, price: e.target.value})}
                  placeholder={language === 'bn' ? 'যেমন: ৫০০ টাকা' : 'e.g., 500 BDT'}
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                />
              </div>

              <button
                onClick={handleAddAd}
                disabled={!newAd.title.trim() || !newAd.description.trim() || !newAd.location.trim() || !newAd.contact.trim()}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-orange-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.postAd}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharingMarketPage;
