
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { KeyRound, Phone, Mail, Shield, LogOut, Edit3, ChevronRight, Camera, X, Save, Settings, User } from 'lucide-react';

const Profile: React.FC<{ onOpenAdmin?: () => void }> = ({ onOpenAdmin }) => {
  const { user, logout, updateUser, promoteToAdmin } = useAuth();
  const { t, language } = useLanguage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdminPinOpen, setIsAdminPinOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminPinError, setAdminPinError] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleEditClick = () => {
    setEditedUser({
      name: user.name,
      email: user.email || '',
      phone: user.phone
    });
    setIsEditMode(true);
  };

  const handleSave = () => {
    updateUser({
      name: editedUser.name,
      email: editedUser.email,
      phone: editedUser.phone,
      profilePicture: profilePicture || undefined
    });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user.name,
      email: user.email || '',
      phone: user.phone
    });
    setProfilePicture(user?.profilePicture || null);
    setIsEditMode(false);
  };

  const handleOpenAdminPin = () => {
    setAdminPin('');
    setAdminPinError(null);
    setIsAdminPinOpen(true);
  };

  const handleAdminPinSubmit = async () => {
    setAdminPinError(null);
    const success = await promoteToAdmin(adminPin.trim());
    if (!success) {
      setAdminPinError(language === 'bn' ? 'ভুল পিন' : 'Invalid PIN');
      return;
    }
    setIsAdminPinOpen(false);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert(language === 'bn' ? 'শুধুমাত্র ছবি ফাইল অনুমোদিত' : 'Only image files are allowed');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'bn' ? 'ফাইল সাইজ ৫ MB এর বেশি হতে পারবে না' : 'File size cannot exceed 5 MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      {isAdminPinOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-7 shadow-2xl border border-white/50">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-800 text-lg">
                {language === 'bn' ? 'অ্যাডমিন পিন দিন' : 'Enter Admin PIN'}
              </h3>
              <button
                onClick={() => setIsAdminPinOpen(false)}
                className="p-2 rounded-2xl hover:bg-gray-100 transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 opacity-70">
              {language === 'bn' ? 'সঠিক পিন দিলে আপনার অ্যাকাউন্ট অ্যাডমিন হবে' : 'Correct PIN will promote your account to admin'}
            </p>

            <div className="mt-5">
              <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-2">
                {language === 'bn' ? 'পিন' : 'PIN'}
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
                placeholder="••••"
              />
              {adminPinError ? (
                <p className="mt-2 text-xs font-bold text-red-600">{adminPinError}</p>
              ) : null}
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={handleAdminPinSubmit}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-green-700 transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>{language === 'bn' ? 'সাবমিট' : 'Submit'}</span>
              </button>
              <button
                onClick={() => setIsAdminPinOpen(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all"
              >
                <X className="w-4 h-4" />
                <span>{t.close}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-green-600 pt-8 pb-20 px-6 rounded-b-[3rem] shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div 
            onClick={handleProfilePictureClick}
            className="w-24 h-24 bg-white rounded-full p-1.5 shadow-2xl mb-4 cursor-pointer hover:scale-105 transition-transform relative group"
          >
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-green-50 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-green-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <h2 className="text-white text-2xl font-extrabold">{user.name}</h2>
          <p className="text-green-100 text-sm font-bold uppercase tracking-widest mt-1 opacity-80">{user.role}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-10 relative z-20">
        {/* Info Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-green-50 space-y-6">
          {isEditMode ? (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-2">
                    {t.name}
                  </label>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-2">
                    {t.phone}
                  </label>
                  <input
                    type="tel"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-2">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-green-700 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-gray-200 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>{t.close}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-4">
                <div className="bg-green-50 p-3 rounded-2xl">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t.phone}</p>
                  <p className="font-bold text-gray-800">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-50 p-3 rounded-2xl">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t.email}</p>
                  <p className="font-bold text-gray-800">{user.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-50 p-3 rounded-2xl">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t.role}</p>
                  <p className="font-bold text-gray-800 uppercase text-xs tracking-wider">{user.role}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Menu Items */}
        <div className="mt-8 space-y-3">
          {!isEditMode && (
            <button 
              onClick={handleEditClick}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 hover:border-green-100 hover:bg-green-50/20 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-700">{t.editProfile}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
            </button>
          )}

          {!isEditMode && user.role === 'admin' && (
            <button
              onClick={() => onOpenAdmin?.()}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 hover:border-green-100 hover:bg-green-50/20 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-50 text-green-600 p-3 rounded-2xl">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-700">{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
            </button>
          )}

          {!isEditMode && user.role !== 'admin' && (
            <button
              onClick={handleOpenAdminPin}
              className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 hover:border-green-100 hover:bg-green-50/20 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-700">{language === 'bn' ? 'অ্যাডমিন পিন দিন' : 'Enter Admin PIN'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
            </button>
          )}
          
          {/* Logout Button */}
          <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-5 bg-red-50/50 rounded-3xl border border-red-100 hover:bg-red-50 transition-all group mt-6"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-2xl">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-bold text-red-600">{t.logout}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
