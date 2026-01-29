
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-4 bg-white/90 backdrop-blur-sm border-t border-gray-100 mt-auto relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs text-gray-500 font-medium">
          Developed by{' '}
          <a 
            href="https://shawonahmed.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-black text-gray-700 hover:text-green-600 transition-colors"
          >
            Md Shawon Ahmed
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
