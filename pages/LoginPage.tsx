import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Phone, Lock, LogIn, UserPlus } from 'lucide-react';

const LoginPage: React.FC<{ onNavigate: (page: 'login' | 'register') => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.phone, formData.password);
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-green-900">{t.login}</h2>
        <p className="mt-2 text-center text-sm text-green-600 font-medium">Powered by Ozysa Ltd.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-green-900/5 rounded-2xl sm:px-10 border border-green-50">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t.phone}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-green-400" />
                </div>
                <input
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t.password}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-green-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50"
              >
                {isLoading ? t.loading : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LogIn className="h-5 w-5 text-green-500 group-hover:text-green-400" />
                    </span>
                    {t.login}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t.noAccount}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => onNavigate('register')}
                className="w-full inline-flex justify-center items-center py-3 px-4 border border-green-600 rounded-xl shadow-sm text-sm font-bold text-green-600 bg-white hover:bg-green-50 transition-all"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                {t.register}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
