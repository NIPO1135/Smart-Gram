
import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BannerAd {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
  active: boolean;
}

const BannerAd: React.FC = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Mock banner ads - in real app, these would come from API
  const bannerAds: BannerAd[] = [
    {
      id: '1',
      title: language === 'bn' ? 'বিশেষ অফার! নতুন গ্রাহকদের জন্য ২০% ছাড়' : 'Special Offer! 20% off for new customers',
      description: language === 'bn' ? 'আজই অর্ডার করুন' : 'Order today',
      link: '#',
      active: true
    },
    {
      id: '2',
      title: language === 'bn' ? 'ডিজিটাল সেবা এখন আরও সহজ' : 'Digital services made easier',
      description: language === 'bn' ? 'আমাদের সাথে যুক্ত হন' : 'Join us today',
      link: '#',
      active: true
    }
  ].filter(ad => ad.active);

  if (!isVisible || bannerAds.length === 0) return null;

  const currentAd = bannerAds[currentAdIndex];

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    if (currentAd.link && currentAd.link !== '#') {
      window.open(currentAd.link, '_blank');
    }
  };

  const handleNext = () => {
    setCurrentAdIndex((prev) => (prev + 1) % bannerAds.length);
  };

  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 mb-4 shadow-lg overflow-hidden group">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all backdrop-blur-sm"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Ad Content */}
      <div 
        onClick={handleClick}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex-1 pr-8">
          <h4 className="text-white font-black text-sm mb-1">{currentAd.title}</h4>
          {currentAd.description && (
            <p className="text-orange-100 text-xs font-bold">{currentAd.description}</p>
          )}
        </div>
        {currentAd.link && currentAd.link !== '#' && (
          <div className="flex-shrink-0">
            <ExternalLink className="w-5 h-5 text-white opacity-80" />
          </div>
        )}
      </div>

      {/* Dots Indicator */}
      {bannerAds.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {bannerAds.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentAdIndex(index);
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentAdIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 w-1.5'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-rotate timer (optional) */}
      {bannerAds.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white/40 transition-all duration-5000"
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default BannerAd;
