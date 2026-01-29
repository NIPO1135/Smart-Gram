
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Clock,
  Bell,
  Camera,
  Send,
  X,
  CheckCircle2,
  Eye
} from 'lucide-react';

type AlertType = 'theft' | 'suspicious' | 'other';
type ViewType = 'feed' | 'alert';

interface Alert {
  id: string;
  type: AlertType;
  location: string;
  description: string;
  time: string;
  author: string;
  urgent: boolean;
}

interface Post {
  id: string;
  author: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
}

const Community: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('feed');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('theft');
  const [alertLocation, setAlertLocation] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [postCreated, setPostCreated] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'theft',
      location: 'North Bazaar Area',
      description: 'Suspicious individuals seen near the market. Please be cautious.',
      time: '10 min ago',
      author: 'Karim Ali',
      urgent: true
    },
    {
      id: '2',
      type: 'suspicious',
      location: 'School Road',
      description: 'Unknown vehicle parked for long time. Neighbors please check.',
      time: '1 hour ago',
      author: 'Fatema Begum',
      urgent: false
    }
  ]);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: "Rahim Uddin",
      time: "2h ago",
      content: "Does anyone know when the new fertilizer stock will arrive at the Union Parishad?",
      likes: 12,
      comments: 5,
      liked: false
    },
    {
      id: '2',
      author: "Sumi Akter",
      time: "5h ago",
      content: "The village primary school is looking for volunteers for the upcoming sports day!",
      likes: 24,
      comments: 8,
      liked: false
    }
  ]);

  const handleCreatePost = () => {
    if (newPostText.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        author: user?.name || 'Anonymous',
        time: 'Just now',
        content: newPostText.trim(),
        likes: 0,
        comments: 0,
        liked: false
      };
      setPosts([newPost, ...posts]);
      setNewPostText('');
      setPostCreated(true);
      setTimeout(() => setPostCreated(false), 2000);
    }
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const handleCommentPost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        };
      }
      return post;
    }));
  };

  const handleSharePost = (post: Post) => {
    const shareText = `${post.content}\n\n- ${post.author}`;
    if (navigator.share) {
      navigator.share({
        title: 'Community Post',
        text: shareText
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Post copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Post copied to clipboard!');
    }
  };

  const handleSendAlert = () => {
    if (alertDescription.trim() && alertLocation.trim()) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: alertType,
        location: alertLocation.trim(),
        description: alertDescription.trim(),
        time: 'Just now',
        author: user?.name || 'Anonymous',
        urgent: alertType === 'theft'
      };
      setAlerts([newAlert, ...alerts]);
      setAlertSent(true);
      setTimeout(() => {
        setShowAlertModal(false);
        setAlertSent(false);
        setAlertDescription('');
        setAlertLocation('');
        setAlertType('theft');
        setCurrentView('alert');
      }, 2000);
    }
  };

  const getAlertTypeLabel = (type: AlertType) => {
    switch(type) {
      case 'theft': return t.alertTheft;
      case 'suspicious': return t.alertSuspicious;
      default: return t.alertOther;
    }
  };

  const getAlertTypeColor = (type: AlertType) => {
    switch(type) {
      case 'theft': return 'bg-red-100 text-red-600 border-red-200';
      case 'suspicious': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    }
  };

  return (
    <div className="pb-44 animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 pt-8 pb-20 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-white/5 rounded-full"></div>
        
        <div className="relative z-10">
          <h2 className="text-white text-3xl font-black mb-2">{t.communityTitle}</h2>
          <p className="text-green-100 text-sm font-bold">{t.communitySubtitle}</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-12 relative z-10">
        {/* Emergency Alert Button - Prominent */}
        <div 
          onClick={() => setShowAlertModal(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-[2.5rem] p-6 shadow-2xl shadow-red-600/30 mb-6 cursor-pointer hover:shadow-red-600/50 hover:-translate-y-1 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-white text-xl font-black">{t.reportThreat}</h3>
                <p className="text-red-100 text-xs font-bold mt-1">{t.alertDesc}</p>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-all">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setCurrentView('feed')}
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm transition-all ${
              currentView === 'feed' 
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                : 'bg-white text-gray-600 border border-gray-100'
            }`}
          >
            {t.communityPosts}
          </button>
          <button
            onClick={() => setCurrentView('alert')}
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm transition-all relative ${
              currentView === 'alert' 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                : 'bg-white text-gray-600 border border-gray-100'
            }`}
          >
            {t.recentAlerts}
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </button>
        </div>

        {/* Alert Feed View */}
        {currentView === 'alert' && (
          <div className="space-y-4 mb-6">
            {alerts.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-12 text-center">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">{t.noAlerts}</p>
                <p className="text-gray-300 text-xs mt-2">{t.staySafe}</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`bg-white rounded-[2.5rem] p-6 shadow-lg border-2 ${
                    alert.urgent ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-2xl ${getAlertTypeColor(alert.type)}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-black text-gray-800 text-sm">{alert.author}</h4>
                          {alert.urgent && (
                            <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              {t.urgent}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-xl mb-3 inline-block ${getAlertTypeColor(alert.type)} border`}>
                    <span className="text-xs font-black">{getAlertTypeLabel(alert.type)}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 font-medium">
                    {alert.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold">{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Community Posts Feed View */}
        {currentView === 'feed' && (
          <>
            {/* Post Box */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 mb-6 relative">
              {postCreated && (
                <div className="absolute -top-12 left-0 right-0 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-black flex items-center justify-center space-x-2 animate-in slide-in-from-top-4">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Post created successfully!</span>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <input 
                  type="text" 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newPostText.trim()) {
                      handleCreatePost();
                    }
                  }}
                  placeholder={t.postPlaceholder}
                  className="flex-1 bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-green-500 outline-none font-medium"
                />
                <button 
                  onClick={handleCreatePost}
                  disabled={!newPostText.trim()}
                  className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-600/20 text-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Create post (or press Enter)"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">No posts yet</p>
                  <p className="text-gray-300 text-xs mt-2">Be the first to share something!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-800 text-sm">{post.author}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{post.time}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center space-x-6">
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            post.liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                          <span className="text-xs font-black">{post.likes}</span>
                        </button>
                        <button 
                          onClick={() => handleCommentPost(post.id)}
                          className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-xs font-black">{post.comments}</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => handleSharePost(post)}
                        className="text-gray-300 hover:text-blue-500 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => !alertSent && setShowAlertModal(false)}
          ></div>
          
          <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            {!alertSent ? (
              <>
                {/* Modal Header */}
                <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-black text-gray-800 text-lg">{t.reportThreat}</span>
                  </div>
                  <button 
                    onClick={() => setShowAlertModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-300" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Alert Type Selection */}
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-3">{t.alertType}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['theft', 'suspicious', 'other'] as AlertType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setAlertType(type)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            alertType === type
                              ? getAlertTypeColor(type) + ' border-current'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <div className="text-xs font-black text-center">{getAlertTypeLabel(type)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Input */}
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">{t.location}</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={alertLocation}
                        onChange={(e) => setAlertLocation(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && alertDescription.trim() && alertLocation.trim()) {
                            handleSendAlert();
                          }
                        }}
                        placeholder="Enter location..."
                        className="w-full pl-12 pr-20 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium"
                      />
                      <button
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                setAlertLocation(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
                              },
                              () => {
                                alert('Location access denied. Please enter manually.');
                              }
                            );
                          } else {
                            alert('Geolocation not supported. Please enter manually.');
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-green-100 text-green-600 rounded-xl text-xs font-black hover:bg-green-200 transition-colors"
                        title={t.shareLocation}
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">{t.describeThreat}</label>
                    <textarea
                      value={alertDescription}
                      onChange={(e) => setAlertDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey && alertDescription.trim() && alertLocation.trim()) {
                          handleSendAlert();
                        }
                      }}
                      placeholder={t.describeThreat}
                      rows={4}
                      className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none resize-none text-sm font-medium"
                    />
                    <p className="text-xs text-gray-400 mt-1">Press Ctrl+Enter to submit</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSendAlert}
                    disabled={!alertDescription.trim() || !alertLocation.trim()}
                    className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Bell className="w-5 h-5" />
                    <span>{t.reportNow}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-600 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-green-900 leading-tight mb-2">{t.alertSent}</h3>
                <p className="text-gray-500 text-sm font-medium">{t.alertSentMsg}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
