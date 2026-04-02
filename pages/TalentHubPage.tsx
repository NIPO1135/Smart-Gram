
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Award,
  Search,
  Plus,
  MapPin,
  Star,
  User,
  Phone,
  CheckCircle2,
  X,
  Music,
  Paintbrush,
  Code,
  Camera,
  Utensils,
  Hammer,
  Upload,
  Image as ImageIcon,
  Video,
  Trash2
} from 'lucide-react';

interface Talent {
  id: string;
  name: string;
  skill: string;
  description: string;
  category: string;
  location: string;
  rating: number;
  image?: string;
}

const TalentHubPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTalent, setNewTalent] = useState({
    skill: '',
    description: '',
    category: 'music',
    location: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const categories = [
    { id: 'music', name: language === 'bn' ? 'সঙ্গীত' : 'Music', icon: Music },
    { id: 'art', name: language === 'bn' ? 'শিল্প' : 'Art', icon: Paintbrush },
    { id: 'tech', name: language === 'bn' ? 'প্রযুক্তি' : 'Technology', icon: Code },
    { id: 'photography', name: language === 'bn' ? 'ফটোগ্রাফি' : 'Photography', icon: Camera },
    { id: 'cooking', name: language === 'bn' ? 'রান্না' : 'Cooking', icon: Utensils },
    { id: 'craft', name: language === 'bn' ? 'কারুশিল্প' : 'Craft', icon: Hammer }
  ];

  const [talents, setTalents] = useState<Talent[]>([
    {
      id: '1',
      name: 'Karim Ali',
      skill: language === 'bn' ? 'হাতের কাজ' : 'Handicraft',
      description: language === 'bn' ? 'বাঁশ ও কাঠের কাজে দক্ষ' : 'Expert in bamboo and woodwork',
      category: 'craft',
      location: 'North Bazaar',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Fatema Begum',
      skill: language === 'bn' ? 'রান্না' : 'Cooking',
      description: language === 'bn' ? 'ঐতিহ্যবাহী খাবার রান্না' : 'Traditional food cooking expert',
      category: 'cooking',
      location: 'School Road',
      rating: 4.9
    },
    {
      id: '3',
      name: 'Rahim Uddin',
      skill: language === 'bn' ? 'সঙ্গীত' : 'Music',
      description: language === 'bn' ? 'বাংলা গান ও বাদ্যযন্ত্র' : 'Bengali songs and musical instruments',
      category: 'music',
      location: 'Market Area',
      rating: 4.7
    }
  ]);

  const filteredTalents = talents.filter(talent => 
    talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    talent.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
    talent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    talent.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (500 MB = 500 * 1024 * 1024 bytes)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(language === 'bn' 
        ? 'ফাইল সাইজ ৫০০ MB এর বেশি হতে পারবে না' 
        : 'File size cannot exceed 500 MB');
      return;
    }

    // Check file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    
    if (!validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      setFileError(language === 'bn' 
        ? 'শুধুমাত্র ছবি বা ভিডিও ফাইল অনুমোদিত' 
        : 'Only image or video files are allowed');
      return;
    }

    setFileError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleAddTalent = () => {
    if (newTalent.skill.trim() && newTalent.description.trim() && newTalent.location.trim()) {
      const talent: Talent = {
        id: Date.now().toString(),
        name: user?.name || 'Anonymous',
        skill: newTalent.skill,
        description: newTalent.description,
        category: newTalent.category,
        location: newTalent.location,
        rating: 0,
        image: filePreview || undefined
      };
      setTalents([talent, ...talents]);
      setNewTalent({ skill: '', description: '', category: 'music', location: '' });
      setSelectedFile(null);
      setFilePreview(null);
      setFileError('');
      setShowAddModal(false);
    }
  };

  const handleContactTalent = (talent: Talent) => {
    const message = language === 'bn' 
      ? `হ্যালো ${talent.name}, আমি আপনার ${talent.skill} সম্পর্কে জানতে চাই।`
      : `Hello ${talent.name}, I'm interested in your ${talent.skill} skills.`;
    const whatsappNumber = "8801700000000";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || Award;
  };

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
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-white text-3xl font-black mb-2">{t.talentHub}</h1>
          <p className="text-orange-100 text-sm font-bold">{t.talentHubDesc}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
        {/* Search Bar */}
        <div className="bg-white rounded-[2rem] p-4 shadow-xl border border-orange-50 mb-6 flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'প্রতিভা খুঁজুন...' : 'Search talents...'}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 p-3 rounded-xl text-white hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTalents.length === 0 ? (
            <div className="col-span-2 bg-white rounded-[2rem] p-12 text-center">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">
                {language === 'bn' ? 'কোনো প্রতিভা পাওয়া যায়নি' : 'No talents found'}
              </p>
            </div>
          ) : (
            filteredTalents.map((talent) => {
              const CategoryIcon = getCategoryIcon(talent.category);
              return (
                <div key={talent.id} className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-100 p-3 rounded-2xl">
                        <CategoryIcon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-800 text-lg">{talent.name}</h3>
                        <p className="text-orange-600 text-sm font-bold">{talent.skill}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-black text-gray-700">{talent.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{talent.description}</p>

                  <div className="flex items-center space-x-2 text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold">{talent.location}</span>
                  </div>

                  <button
                    onClick={() => handleContactTalent(talent)}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-md shadow-orange-600/20 flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{language === 'bn' ? 'যোগাযোগ করুন' : 'Contact'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Talent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setShowAddModal(false)}
          ></div>
          
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-50">
              <span className="font-black text-gray-800 text-lg">
                {language === 'bn' ? 'আপনার প্রতিভা যোগ করুন' : 'Add Your Talent'}
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
                  {language === 'bn' ? 'আপনার দক্ষতা' : 'Your Skill'}
                </label>
                <input
                  type="text"
                  value={newTalent.skill}
                  onChange={(e) => setNewTalent({...newTalent, skill: e.target.value})}
                  placeholder={language === 'bn' ? 'যেমন: হাতের কাজ' : 'e.g., Handicraft'}
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {language === 'bn' ? 'বর্ণনা' : 'Description'}
                </label>
                <textarea
                  value={newTalent.description}
                  onChange={(e) => setNewTalent({...newTalent, description: e.target.value})}
                  placeholder={language === 'bn' ? 'আপনার দক্ষতা সম্পর্কে বিস্তারিত...' : 'Describe your skills...'}
                  rows={3}
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none resize-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                </label>
                <select
                  value={newTalent.category}
                  onChange={(e) => setNewTalent({...newTalent, category: e.target.value})}
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {t.location}
                </label>
                <input
                  type="text"
                  value={newTalent.location}
                  onChange={(e) => setNewTalent({...newTalent, location: e.target.value})}
                  placeholder={language === 'bn' ? 'আপনার অবস্থান' : 'Your location'}
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                />
              </div>

              {/* Photo/Video Upload */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">
                  {language === 'bn' ? 'ছবি/ভিডিও (সর্বোচ্চ ৫০০ MB)' : 'Photo/Video (Max 500 MB)'}
                </label>
                
                {!filePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:border-orange-400 cursor-pointer transition-all"
                    >
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <span className="text-sm font-bold text-gray-600 mb-1">
                        {language === 'bn' ? 'ক্লিক করে ফাইল নির্বাচন করুন' : 'Click to select file'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {language === 'bn' ? 'ছবি বা ভিডিও (সর্বোচ্চ ৫০০ MB)' : 'Image or Video (Max 500 MB)'}
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    {selectedFile?.type.startsWith('image/') ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={handleRemoveFile}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs font-bold">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center space-x-2">
                              <ImageIcon className="w-4 h-4" />
                              <span>{selectedFile.name}</span>
                            </span>
                            <span>{formatFileSize(selectedFile.size)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-900">
                        <video
                          src={filePreview}
                          controls
                          className="w-full h-48 object-cover"
                        />
                        <button
                          onClick={handleRemoveFile}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs font-bold">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center space-x-2">
                              <Video className="w-4 h-4" />
                              <span>{selectedFile.name}</span>
                            </span>
                            <span>{formatFileSize(selectedFile.size)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {fileError && (
                  <p className="mt-2 text-sm text-red-600 font-bold">{fileError}</p>
                )}
                
                {selectedFile && !fileError && (
                  <p className="mt-2 text-xs text-gray-500 font-medium">
                    {language === 'bn' 
                      ? `ফাইল নির্বাচিত: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`
                      : `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`}
                  </p>
                )}
              </div>

              <button
                onClick={handleAddTalent}
                disabled={!newTalent.skill.trim() || !newTalent.description.trim() || !newTalent.location.trim()}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-orange-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{language === 'bn' ? 'যোগ করুন' : 'Add Talent'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentHubPage;
