
import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppConfigProvider } from './context/AppConfigContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EmergencyPage from './pages/EmergencyPage';
import AgriServicePage from './pages/AgriServicePage';
import ShoppingPage from './pages/ShoppingPage';
import BloodBankPage from './pages/BloodBankPage';
import AdminPanel from './pages/AdminPanel';
import YouthLearnPage from './pages/YouthLearnPage';

type AppTab = 'home' | 'profile';
type AppView = 'dashboard' | 'emergency' | 'agriculture' | 'shopping' | 'blood' | 'youthLearn' | 'admin';

const Main: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const prevUserRef = useRef(user);

  useEffect(() => {
    if (!prevUserRef.current && user) {
      setActiveTab('home');
      setCurrentView('dashboard');
    }
    prevUserRef.current = user;
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-green-800 font-bold">Smart Village</p>
        </div>
      </div>
    );
  }

  const renderAuthenticatedContent = () => {
    if (currentView === 'admin') {
      return (
        <AdminPanel
          onBack={() => {
            setActiveTab('home');
            setCurrentView('dashboard');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'home': 
        if (currentView === 'emergency') return <EmergencyPage onBack={() => setCurrentView('dashboard')} />;
        if (currentView === 'agriculture') return <AgriServicePage onBack={() => setCurrentView('dashboard')} />;
        if (currentView === 'shopping') return <ShoppingPage onBack={() => setCurrentView('dashboard')} />;
        if (currentView === 'blood') return <BloodBankPage onBack={() => setCurrentView('dashboard')} />;
        if (currentView === 'youthLearn') return <YouthLearnPage onBack={() => setCurrentView('dashboard')} />;
        return <Dashboard onViewChange={(view) => setCurrentView(view as AppView)} />;
      case 'profile':
        return <Profile onOpenAdmin={() => setCurrentView('admin')} />;
      default: return <Dashboard />;
    }
  };

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        {user ? (
          renderAuthenticatedContent()
        ) : authView === 'login' ? (
          <LoginPage onNavigate={setAuthView} />
        ) : (
          <RegistrationPage onNavigate={setAuthView} />
        )}
      </main>
      
      {user ? (
        <>
          <div className="pb-24">
            <Footer />
          </div>
          <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
        </>
      ) : (
        <>
          <footer className="py-12 text-center bg-white border-t border-green-100">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© 2024 Smart Village Community</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-green-600 hover:text-green-700 text-[10px] font-bold uppercase tracking-tighter">Privacy</a>
              <a href="#" className="text-green-600 hover:text-green-700 text-[10px] font-bold uppercase tracking-tighter">Terms</a>
            </div>
          </footer>
          <Footer />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppConfigProvider>
          <Main />
        </AppConfigProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
