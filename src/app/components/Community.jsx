import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../utils/supabase";


import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import SignOutButton from "./SignOutButton";
import CelebrationPopup from "./CelebrationPopup";

import TwitterModal from "./TwitterModal";
import DiscordModal from "./DiscordModal";

const LoadingOverlay = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center min-w-80 max-w-md border border-white border-opacity-20">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
        <div className="text-lg text-gray-800 font-semibold leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
};



const GameButton = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseClasses = "relative overflow-hidden font-bold py-3 px-6 rounded-lg transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg skew-x-[-10deg] hover:skew-x-[-5deg]";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-2 border-purple-400",
    secondary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-2 border-blue-400",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-2 border-green-400",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-2 border-red-400"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 skew-x-[10deg]"></div>
      <div className="relative z-10 flex items-center gap-2 skew-x-[10deg]">
        {children}
      </div>
    </button>
  );
};

const BadgeAnimation = ({ show, points, message, onComplete }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: [0, 1, 1, 1, 0],
          y: [0, -20, -20, 100, 200],
          rotate: [0, 5, -5, 0]
        }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ 
          duration: 3,
          times: [0, 0.3, 0.4, 0.8, 1],
          ease: "easeInOut"
        }}
        onAnimationComplete={onComplete}
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-xl opacity-100 animate-pulse"></div>
          
          {/* Main badge */}
          <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 rounded-full border-4 border-gradient-to-r from-purple-400 to-pink-400 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                +{points}
              </div>
              <div className="text-lg font-semibold text-white">POINTS</div>
            </div>
          </div>
          
          {/* Message below badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-center"
          >
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap">
              {message}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const PostModal = ({ isOpen, onClose, onSubmit, session }) => {
  // Helper functions to extract data from session
  const getUsernameFromSession = () => {
    if (session?.twitter_username) return session.twitter_username;
    if (session?.discord_username) return session.discord_username;
    if (session?.user?.name) return session.user.name;
    return 'Anonymous User';
  };

  const getUserImageFromSession = () => {
     return session?.user?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'; // Default avatar
  };

  const [formData, setFormData] = useState({
    username: getUsernameFromSession(),
    post_text: '',
    twitter_post_url: '',
    photo_url: '',
    avatar_url: getUserImageFromSession()
  });

  // Update form data when session changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      username: getUsernameFromSession(),
      avatar_url: getUserImageFromSession()
    }));
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.post_text || !formData.twitter_post_url) {
      alert('Please fill in your story and Twitter post URL');
      return;
    }
    
    await onSubmit(formData);
    // Reset only the editable fields
    setFormData(prev => ({ 
      ...prev, 
      post_text: '', 
      twitter_post_url: '', 
      photo_url: '' 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-purple-900 p-8 rounded-2xl border-2 border-purple-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Share Your Aura</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display user info (non-editable) */}
          <div className="bg-gray-800/50 p-4 rounded-lg border border-purple-400">
            <div className="flex items-center gap-4">
              <img 
                src={formData.avatar_url} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full border-2 border-purple-500"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <div>
                <p className="text-white font-semibold text-lg">{formData.username}</p>
                <p className="text-purple-300 text-sm">Logged in user</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Your Story *</label>
            <textarea
              value={formData.post_text}
              onChange={(e) => setFormData({...formData, post_text: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-purple-500 focus:border-pink-500 focus:outline-none h-32 resize-none"
              placeholder="Tell your aura story..."
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Twitter Post URL *</label>
            <input
              type="url"
              value={formData.twitter_post_url}
              onChange={(e) => setFormData({...formData, twitter_post_url: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-purple-500 focus:border-pink-500 focus:outline-none"
              placeholder="https://twitter.com/user/status/..."
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Photo URL (Optional)</label>
            <input
              type="url"
              value={formData.photo_url}
              onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-purple-500 focus:border-pink-500 focus:outline-none"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <GameButton type="submit" variant="success" className="flex-1">
              🚀 Submit Post
            </GameButton>
            <GameButton type="button" onClick={onClose} variant="danger" className="flex-1">
              ❌ Cancel
            </GameButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CommunityCard = ({ post }) => {
  // Handle avatar fallback
  const getAvatarSrc = () => {
    if (!post.avatar_url || post.avatar_url === '' || post.avatar_url === 'null') {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username || 'User')}&background=6366f1&color=fff&size=128&bold=true`;
    }
    return post.avatar_url;
  };

  return (
    <>
      <div className="min-w-[320px] mx-2 transform transition-transform hover:scale-102">
        {/* Main Comic Panel */}
        <div className="relative bg-white p-2 rounded-3xl border-6 border-black shadow-2xl">
          
          {/* Inner Gradient Panel */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-1 rounded-2xl border-4 border-black relative overflow-hidden">
            
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-15">
              <div className="comic-halftone w-full h-full"></div>
            </div>
            
            {/* Main Content Area - Full Card Background */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-xl relative z-10">
              
              {/* Header Section with User Info */}
              <div className="bg-white p-3 rounded-xl border-4 border-black mb-4 relative">
                <div className="flex items-center gap-3">
                  {/* Avatar with better fallback handling */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-black bg-white p-0.5 shadow-lg">
                      <img 
                        src={getAvatarSrc()}
                        alt={post.username}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username || 'User')}&background=6366f1&color=fff&size=128&bold=true`;
                        }}
                      />
                    </div>
                    {/* Comic-style shine effect */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-black"></div>
                  </div>
                  
                  {/* User Info Card */}
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-lg border-3 border-black">
                      <h4 className="font-comic font-black text-lg tracking-wide">{post.username}</h4>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm">📅</span>
                      <p className="text-gray-700 text-sm font-comic font-bold">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Speech Bubble for Post Content */}
              <div className="relative mb-4">
                <div className="bg-yellow-300 border-4 border-black rounded-2xl p-4 relative shadow-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">💭</span>
                    <p className="text-black font-comic  text-base leading-tight line-clamp-4">
                      "{post.post_text}"
                    </p>
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-3 left-6 w-0 h-0">
                    <div className="border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-black"></div>
                    <div className="absolute -top-1 left-0.5 border-l-5 border-l-transparent border-r-5 border-r-transparent border-t-5 border-t-yellow-300"></div>
                  </div>
                </div>
              </div>
              
              {/* Image Section */}
              {post.photo_url && (
                <div className="bg-white p-2 rounded-xl border-4 border-black mb-4 shadow-lg">
                  <div className="relative">
                    <img 
                      src={post.photo_url} 
                      alt="User post"
                      className="w-full h-36 object-cover rounded-lg border-2 border-gray-400"
                    />
                    {/* Comic-style image frame effect */}
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-comic font-bold px-2 py-1 rounded border-2 border-black">
                      PIC!
                    </div>
                  </div>
                </div>
              )}
              
              {/* Twitter Button - Now inside the pink background */}
              {post.twitter_post_url && (
                <div className="mb-4">
                  <button 
                    onClick={() => window.open(post.twitter_post_url, '_blank')}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-comic font-black px-4 py-3 rounded-xl border-4 border-black shadow-lg text-base tracking-wider transform transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {/* <span className="text-xl">🐦</span> */}
                      <span>VIEW ON 𝕏!</span>
                    </span>
                  </button>
                </div>
              )}

              {/* Reaction Badges - Now inside the pink background */}
              <div className="flex justify-center gap-2">
                <div className="bg-pink-400 text-black px-3 py-1.5 rounded-full border-3 border-black font-comic font-black text-xs shadow-md">
                  <span className="flex items-center gap-1">
                    <span>💖</span>
                    <span>LOVE</span>
                  </span>
                </div>
                <div className="bg-green-400 text-black px-3 py-1.5 rounded-full border-3 border-black font-comic font-black text-xs shadow-md">
                  <span className="flex items-center gap-1">
                    <span>⭐</span>
                    <span>COOL</span>
                  </span>
                </div>
                <div className="bg-orange-400 text-black px-3 py-1.5 rounded-full border-3 border-black font-comic font-black text-xs shadow-md">
                  <span className="flex items-center gap-1">
                    <span>🔥</span>
                    <span>WOW</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Creepster&family=Fredoka+One:wght@400&display=swap');
        
        .font-comic {
          font-family: 'Bangers', 'Fredoka One', cursive;
          letter-spacing: 0.05em;
          text-shadow: 1px 1px 0px rgba(0,0,0,0.3);
        }
        
        .comic-halftone {
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 2px, transparent 2px),
            radial-gradient(circle at 60% 60%, rgba(255,255,255,0.6) 1px, transparent 1px),
            radial-gradient(circle at 80% 30%, rgba(255,255,255,0.4) 1.5px, transparent 1.5px);
          background-size: 25px 25px, 15px 15px, 35px 35px;
          background-position: 0 0, 10px 10px, 20px 5px;
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        .border-5 {
          border-width: 5px;
        }
        
        .border-6 {
          border-width: 6px;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        /* Enhanced hover effects */
        button:hover {
          transform: scale(1.05) !important;
          filter: brightness(1.1);
        }
        
        /* Better avatar handling */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        
        /* Comic-style shadows */
        .shadow-comic {
          box-shadow: 
            4px 4px 0px #000,
            8px 8px 0px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  );
};

// Add this toast notification component at the top
const Toast = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg max-w-sm`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">✕</button>
      </div>
    </motion.div>
  );
};

const Community = () => {
  const { data: session, status } = useSession();
   console.log('Session Status:', status)
  console.log('Session Data:', session)
  const [showBadge, setShowBadge] = useState(false);
  const [badgeData, setBadgeData] = useState({ points: 0, message: '' });
  const [showPostModal, setShowPostModal] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [callbackHandled, setCallbackHandled] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  
const [loadingState, setLoadingState] = useState({
    isVisible: false,
    message: 'Please wait...',
    activeLoaders: new Map()
  });

    // Create a ref-based loading manager
  const loadingManager = useRef({
    showLoading: (loaderId, message = 'Please wait...') => {
      console.log('showLoading called:', loaderId, message);
      
      setLoadingState(prevState => {
        const newActiveLoaders = new Map(prevState.activeLoaders);
        newActiveLoaders.set(loaderId, message);
        
        return {
          isVisible: true,
          message: message,
          activeLoaders: newActiveLoaders
        };
      });
    },

    hideLoading: (loaderId) => {
      console.log('hideLoading called:', loaderId);
      
      setLoadingState(prevState => {
        const newActiveLoaders = new Map(prevState.activeLoaders);
        newActiveLoaders.delete(loaderId);
        
        const stillHasLoaders = newActiveLoaders.size > 0;
        const latestMessage = stillHasLoaders ? 
          Array.from(newActiveLoaders.values()).pop() : 
          'Please wait...';
        
        return {
          isVisible: stillHasLoaders,
          message: latestMessage,
          activeLoaders: newActiveLoaders
        };
      });
    },

    updateMessage: (loaderId, message) => {
      console.log('updateMessage called:', loaderId, message);
      
      setLoadingState(prevState => {
        if (prevState.activeLoaders.has(loaderId)) {
          const newActiveLoaders = new Map(prevState.activeLoaders);
          newActiveLoaders.set(loaderId, message);
          
          return {
            ...prevState,
            message: message,
            activeLoaders: newActiveLoaders
          };
        }
        return prevState;
      });
    }
  });

  // Twitter modal state
const [twitterModal, setTwitterModal] = useState({
  show: false,
  type: null,
  username: '',
  avatarUrl: ''
});

// Discord modal state
const [discordModal, setDiscordModal] = useState({
  show: false,
  type: null,
  username: '',
  avatarUrl: ''
});

  // Add these refs at the top of your component (before the return statement)
const containerRef = useRef(null);
const titlePanelRef = useRef(null);
const descriptionPanelRef = useRef(null);
const gameCardsRef = useRef([]);
const communityTitleRef = useRef(null);
const communityPostsRef = useRef(null);
const actionButtonsRef = useRef([]);

// Add this useEffect for GSAP animations (before the return statement)
useEffect(() => {
  const ctx = gsap.context(() => {
    // Initial setup - hide elements
    gsap.set(titlePanelRef.current, { 
      x: 1500, 
      opacity: 0, 
      rotation: 10 
    });
    gsap.set(descriptionPanelRef.current, { 
      y: 100, 
      opacity: 0, 
      scale: 0.8 
    });
    gsap.set(gameCardsRef.current, { 
      y: 150, 
      opacity: 0, 
      rotation: 5,
      scale: 0.9 
    });
    gsap.set(communityTitleRef.current, { 
      y: 100, 
      opacity: 0, 
      scale: 0.8 
    });
    gsap.set(communityPostsRef.current, { 
      y: 100, 
      opacity: 0 
    });
    gsap.set(actionButtonsRef.current, { 
      y: 50, 
      opacity: 0, 
      scale: 0.8 
    });

    // Main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Title panel entrance
    tl.to(titlePanelRef.current, {
      x: 0,
      opacity: 1,
      rotation: 0,
      duration: 1.2,
      ease: "back.out(1.7)"
    })
    // Description panel
    .to(descriptionPanelRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    // Game cards staggered entrance
    .to(gameCardsRef.current, {
      y: 0,
      opacity: 1,
      rotation: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.2
    }, "-=0.4")
    // Community title
    .to(communityTitleRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "bounce.out"
    }, "-=0.2")
    // Community posts
    .to(communityPostsRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")
    // Action buttons
    .to(actionButtonsRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.1
    }, "-=0.2");

    // Continuous floating animations
    gsap.to(titlePanelRef.current, {
      y: -10,
      rotation: 1,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(descriptionPanelRef.current, {
      y: -5,
      duration: 2.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 0.5
    });

    // Game cards floating
    gameCardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          y: -8,
          rotation: index % 2 === 0 ? 1 : -1,
          duration: 2 + index * 0.3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.2
        });
      }
    });

    // Button hover animations
    actionButtonsRef.current.forEach((button) => {
      if (button) {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.1,
            rotation: 2,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      }
    });

  }, containerRef);

  return () => ctx.revert();
}, []);

   // Toast helper function
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const showPointsBadge = (points, message) => {
    setBadgeData({ points, message });
    setShowBadge(true);
  };

// Get username based on session
  const getUsernameFromSession = () => {
  
  if (session?.twitter_username) return session.twitter_username;
  if (session?.discord_username) return session.discord_username;
  if (session?.user?.name) return session.user.name;
  return null;
  };

// Get user image based on session
const getUserImageFromSession = () => {
  if (session?.twitter_username) return session.user.image;
  if (session?.discord_username) return session.user.image;
  return null; // or return a default avatar URL
};



// Updated useEffect with proper callback detection and prevention of infinite loop
 // Universal session handler for both Twitter and Discord
  useEffect(() => {
    console.log("=== Universal Session Handler ===");
    console.log("Session status:", status);
    console.log("Callback handled:", callbackHandled);

    if (status === "loading") return;
    if (!session || callbackHandled) return;

    const handleSessionCallback = async () => {
      const username = getUsernameFromSession();
      const avatar= getUserImageFromSession();
      const provider = session.provider;
      
      console.log("Processing session for:", { username, provider });

      if (!username || !provider) return;

      try {
        // Check if this is a callback (new authentication)
        const urlParams = new URLSearchParams(window.location.search);
        const hasOAuthCode = urlParams.has('code') || urlParams.has('oauth_token') || urlParams.has('oauth_verifier');
        const justCompletedOAuth = 
          sessionStorage.getItem(`${provider}_oauth_in_progress`) === 'true';
        
        const isCallback = hasOAuthCode || justCompletedOAuth;
        
        console.log("Is callback:", isCallback, "Provider:", provider);

        if (isCallback) {
          setCallbackHandled(true);
          sessionStorage.removeItem(`${provider}_oauth_in_progress`);
          
          if (provider === 'twitter') {
            await handleFirstTimeTwitterConnection(username,avatar, true); // true = is callback
          } else if (provider === 'discord') {
            await handleFirstTimeDiscordConnection(username,avatar, true); // true = is callback
          }
          
          // Clean up URL
          if (hasOAuthCode) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
          }
        }
      } catch (error) {
        console.error('Error in session callback:', error);
        setCallbackHandled(true);
        showToast("Connected successfully! Please refresh if points don't appear.", 'success');
      }
    };

    handleSessionCallback();
  }, [session, status, callbackHandled]);



// Replace your existing useEffect for handling URL parameters with this fixed version:
//manual oauth for discord
useEffect(() => {
  console.log('=== URL Parameter Handler ===');
  console.log('Current URL:', window.location.href);
  console.log('Hash:', window.location.hash);
  
  // Parse parameters from hash fragment instead of search params
  const hash = window.location.hash;
  let params;
  
  if (hash.includes('?')) {
    // Extract the query string part from the hash
    const queryString = hash.split('?')[1];
    params = new URLSearchParams(queryString);
    console.log('Hash query string:', queryString);
  } else {
    // Fallback to regular search params (shouldn't happen with your setup)
    params = new URLSearchParams(window.location.search);
    console.log('Using search params as fallback');
  }
  
  console.log('All parsed params:', Object.fromEntries(params.entries()));
  
  // Handle Discord OAuth success
  const discordSuccess = params.get('discord_success');
  const discordUsername = params.get('discord_username');
  const discordId = params.get('discord_id');
  const discordError = params.get('discord_error');

  console.log('Discord success:', discordSuccess);
  console.log('Discord username:', discordUsername);
  console.log('Discord ID:', discordId);
  console.log('Discord error:', discordError);
  console.log('OAuth in progress flag:', sessionStorage.getItem('discord_oauth_in_progress'));

  if (discordSuccess === 'true' && discordUsername && sessionStorage.getItem('discord_oauth_in_progress')) {
    console.log('Processing Discord OAuth success...');
    handleDiscordOAuthSuccess(discordUsername, discordId);
    
    // Clean URL immediately - remove the query params from hash
    console.log('Cleaning URL...');
    const cleanHash = hash.split('?')[0]; // Keep only the route part of the hash
    window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
    
  } else if (discordError) {
    console.log('Processing Discord error:', discordError);
    
    const errorMessages = {
      'oauth_code_missing': 'Discord OAuth failed - missing code',
      'oauth_failed': 'Discord OAuth failed - please try again',
    };
    
    showToast(errorMessages[discordError] || 'Discord connection failed', 'error');
    sessionStorage.removeItem('discord_oauth_in_progress');
    sessionStorage.removeItem('primary_username');
    
    // Clean URL
    const cleanHash = hash.split('?')[0];
    window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
  } else {
    console.log('No Discord OAuth to process');
    console.log('Reasons:');
    console.log('- discordSuccess:', discordSuccess);
    console.log('- discordUsername:', discordUsername);
    console.log('- oauth_in_progress flag:', sessionStorage.getItem('discord_oauth_in_progress'));
  }
}, []);

// this is for the callback handler for twitter manual oAuth
useEffect(() => {
  console.log('=== URL Parameter Handler ===');
  console.log('Current URL:', window.location.href);
  console.log('Hash:', window.location.hash);
  
  // Parse parameters from hash fragment instead of search params
  const hash = window.location.hash;
  let params;
  
  if (hash.includes('?')) {
    // Extract the query string part from the hash
    const queryString = hash.split('?')[1];
    params = new URLSearchParams(queryString);
    console.log('Hash query string:', queryString);
  } else {
    // Fallback to regular search params (shouldn't happen with your setup)
    params = new URLSearchParams(window.location.search);
    console.log('Using search params as fallback');
  }
  
  console.log('All parsed params:', Object.fromEntries(params.entries()));

  const twitterSuccess = params.get('twitter_success');
const twitterUsername = params.get('twitter_username');
const twitterId = params.get('twitter_id');
const twitterError = params.get('twitter_error');
console.log('Twitter success:', twitterSuccess);
  console.log('Twitter username:', twitterUsername);
  console.log('Twitter ID:', twitterId);
  console.log('Twitter error:', twitterError);
  console.log('OAuth in progress flag:', sessionStorage.getItem('twitter_oauth_in_progress'));

if (twitterSuccess && twitterUsername && sessionStorage.getItem('twitter_oauth_in_progress')) {
  // Link Twitter username to the current user in Supabase
 handleTwitterOAuthSuccess(twitterUsername, twitterId);

  // Clean URL immediately - remove the query params from hash
    console.log('Cleaning URL...');
    const cleanHash = hash.split('?')[0]; // Keep only the route part of the hash
    window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
}
 else if (twitterError) {
    console.log('Processing Twitter error:', twitterError);
    
    const errorMessages = {
      'oauth_code_missing': 'Twitter OAuth failed - missing code',
      'oauth_failed': 'Twitter OAuth failed - please try again',
    };
    
    showToast(errorMessages[twitterError] || 'Twitter connection failed', 'error');
    sessionStorage.removeItem('Twitter_oauth_in_progress');
    sessionStorage.removeItem('primary_username');
    
    // Clean URL
    const cleanHash = hash.split('?')[0];
    window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
  } else {
    console.log('No Twitter OAuth to process');
    console.log('Reasons:');
    console.log('- TwitterSuccess:', twitterSuccess);
    console.log('- TwitterUsername:', twitterUsername);
    console.log('- oauth_in_progress flag:', sessionStorage.getItem('twitter_oauth_in_progress'));
  }
}, []);

// Update your syncTwitterUser function
// Updated syncTwitterUser function with better duplicate prevention
// 1 Updated syncTwitterUser function
const syncTwitterUser = async (twitterUsername,avatar, isFollowing = false, isFirstTime = false) => {
  try {
    console.log("Syncing Twitter user:", twitterUsername, "Following:", isFollowing, "First time:", isFirstTime);
    
    const response = await fetch('/api/sync-twitter-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: twitterUsername,        // ✅ Change this
        twitterUsername: twitterUsername, // Keep this for additional info
        avatarUrl: avatar,                // ✅ Add avatar URL
        isFollowing,
        isFirstTime
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to sync Twitter user');
    }

    console.log('Twitter user synced:', data);
    return data;

  } catch (error) {
    console.error('Error syncing Twitter user:', error);
    showPointsBadge(0, "Connection successful, but couldn't update points. Please refresh!");
    throw error;
  }
};

// Update your syncDiscordUser function
// Updated syncDiscordUser function with better duplicate prevention
// 2 Updated syncDiscordUser function
const syncDiscordUser = async (discordUsername, avatar,isFollowing = false, isFirstTime = false) => {
  try {
    console.log("Syncing Discord user:", discordUsername, "Following:", isFollowing, "First time:", isFirstTime);
    
    const response = await fetch('/api/sync-discord-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discordUsername,
        avatarUrl: avatar, // ✅ Add avatar URL
        isFollowing,
        isFirstTime
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to sync Discord user');
    }

    console.log('Discord user synced:', data);
    return data;

  } catch (error) {
    console.error('Error syncing Discord user:', error);
    showPointsBadge(0, "Connection successful, but couldn't update points. Please refresh!");
    throw error;
  }
};

// 3 Simplified handleDiscordConnect using API routes
const handleDiscordConnect = async () => {
  // Check if user is already connected to Discord via NextAuth
  if (session?.discord_username) {
    const username = session.discord_username || session.user?.name;
    const avatar = session.user?.image || null; // Use user image if available
    console.log('Handling Discord connect for user:', username);
    
    try {
      // Check user status via API
      const userStatus = await getUserStatus(username, 'discord');
      
      if (!userStatus.exists) {
        // User doesn't exist - first time connecting
        await handleFirstTimeDiscordConnection(username, avatar);
        console.log('User doesnt exist - first time connecting', username);
      } else {
        const existingUser = userStatus.user;
        console.log('User exists - check if theyve already received Discord points', username);
        
        if (existingUser.discord_connected && existingUser.discord_joined_server) {
          console.log('User already received all Discord-related points', username);
          showPointsBadge(0, `Welcome back, ${username}! You're already following us! 🎉`);
        } else if (existingUser.discord_connected && !existingUser.discord_joined_server) {
          console.log('User connected but hasnt received follow points yet', username);
          await giveDiscordFollowPoints(username, existingUser.total_points || 0, avatar);
        } else {
          console.log('User exists but hasnt connected Discord yet', username);
          await handleFirstTimeDiscordConnection(username, avatar);
        }
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      showPointsBadge(0, "Error checking status. Please try refreshing the page!");
    }
  } 
  else if (session?.twitter_username) {
    // Start OAuth flow for users already connected via Twitter
    console.log('User not connected to Discord - starting Manual flow');
    try {
      sessionStorage.setItem('discord_oauth_in_progress', 'true');
      
      const primaryUsername = session?.twitter_username || session?.user?.name;
      if (primaryUsername) {
        sessionStorage.setItem('primary_username', primaryUsername);
      }
      
      const discordOAuthUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`;
      window.location.href = discordOAuthUrl;
    } catch (error) {
      console.error('Error starting Discord OAuth:', error);
      sessionStorage.removeItem('discord_oauth_in_progress');
      showToast("Error connecting to Discord. Please try again!", 'error');
    }
  }
  else {
    // Start OAuth flow for new users authenticating via Discord NextAuth
    console.log('User not connected to Discord - starting OAuth flow');
    try {
      sessionStorage.setItem('discord_oauth_in_progress', 'true');
      await signIn("discord", { 
        callbackUrl: window.location.origin + "/#community" 
      });
    } catch (error) {
      console.error('Error starting Discord OAuth:', error);
      sessionStorage.removeItem('discord_oauth_in_progress');
      showToast("Error connecting to Discord. Please try again!", 'error');
    }
  }
};


//4 Updated function to get user status
const getUserStatus = async (username, platform) => {
  try {
    const response = await fetch(`/api/get-user-status?username=${encodeURIComponent(username)}&platform=${platform}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get user status');
    }

    return data;
  } catch (error) {
    console.error('Error getting user status:', error);
    throw error;
  }
};

// //N Handle first-time Discord connection using API
// const handleFirstTimeDiscordConnection = async (username, avatar, isCallback = false) => {
//   const userWantsToJoin = window.confirm(
//     `Want to earn +50 more points? 🎮\n\n` +
//     "Join our Discord server for:\n" +
//     "• Exclusive updates and announcements\n" +
//     "• Chat with the community\n" +
//     "• Early access to features\n" +
//     "• +50 bonus points! 💎\n\n" +
//     "Click OK to open Discord and join our server!"
//   );

//   if (userWantsToJoin) {
//     window.open('https://discord.gg/rfmtNCpq', '_blank');
//     // Give user benefit of doubt and award full points
//     await syncDiscordUser(username, avatar, true, true); // true for following, true for first time
//     showPointsBadge(50, "Welcome to Aura! Thanks for following! +50 Points! 🎉");
//   } else {
//     // Still give connection points, but not follow points
//     await syncDiscordUser(username, avatar, false, true); // false for following, true for first time
//     showPointsBadge(50, "Discord Connected! +50 Points! Follow us anytime for +50 more! 🐦");
//   }
// };

// Updated handleFirstTimeDiscordConnection function
const handleFirstTimeDiscordConnection = async (username, avatar, isCallback = false) => {
  // Show the modal instead of window.confirm
  setDiscordModal({
    show: true,
    type: 'firstTime',
    username: username,
    avatarUrl: avatar
  });
};

// Updated giveDiscordFollowPoints function
const giveDiscordFollowPoints = async (username, currentPoints = 0, avatarUrl = '') => {
  // Show the modal instead of window.confirm
  setDiscordModal({
    show: true,
    type: 'existingUser',
    username: username,
    avatarUrl: avatarUrl,
    currentPoints: currentPoints
  });
};

// Handle modal confirm for first time users
const handleDiscordFirstTimeConfirm = async () => {
  const { username, avatarUrl } = discordModal;
  
  // Give user benefit of doubt and award full points
  await syncDiscordUser(username, avatarUrl, true, true); // true for joining, true for first time
  showPointsBadge(50, "Welcome to Aura! Thanks for joining Discord! +50 Points! 🎉");
};

// Handle modal cancel for first time users  
const handleDiscordFirstTimeCancel = async () => {
  const { username, avatarUrl } = discordModal;
  
  // Still give connection points, but not join points
  await syncDiscordUser(username, avatarUrl, false, true); // false for joining, true for first time
  showPointsBadge(50, "Discord Connected! +50 Points! Join us anytime for +50 more! 🎮");
};

// Handle modal confirm for existing users
const handleDiscordExistingUserConfirm = async () => {
  const { username, currentPoints } = discordModal;
  
  // Update user as joined and give points
  await updateDiscordFollowStatus(username, currentPoints);
  showPointsBadge(50, "Thanks for joining Discord! +50 Points! 🎉");
};

// Handle modal cancel for existing users
const handleDiscordExistingUserCancel = () => {
  showPointsBadge(0, "No worries! Join us anytime for +50 points! 🎮");
};

// Close Discord modal function
const closeDiscordModal = () => {
  setDiscordModal({
    show: false,
    type: null,
    username: '',
    avatarUrl: ''
  });
};

// Update Discord server join status
  const updateDiscordServerStatus = async (username, currentPoints = 0) => {
    try {
      const { error: updateError } = await supabase
        .from("user_leaderboard")
        .update({
          discord_joined_server: true,
          total_points: currentPoints + 50,
          updated_at: new Date().toISOString()
        })
        .eq("username", username);

      if (updateError) throw updateError;

      await supabase.from("point_transactions").insert([{
        username: username,
        activity_type: "discord_join_server",
        points_earned: 50,
        description: "Joined Discord server",
      }]);

    } catch (error) {
      console.error('Error updating Discord server status:', error);
      throw error;
    }
  };

 //N Updated handleDiscordOAuthSuccess with debug logging
const handleDiscordOAuthSuccess = async (discordUsername, discordId) => {
  try {
    console.log('=== handleDiscordOAuthSuccess ===');
    console.log('Discord username:', discordUsername);
    console.log('Discord ID:', discordId);
    
    const primaryUsername = sessionStorage.getItem('primary_username');
    let finalUsername = primaryUsername || discordUsername;
    
    console.log('Primary username from session:', primaryUsername);
    console.log('Final username to use:', finalUsername);

    // Check if user exists
    console.log('Checking if user exists in Supabase...');
    const { data: existingUser, error: fetchError } = await supabase
      .from("user_leaderboard")
      .select("*")
      .eq("username", finalUsername)
      .single();

    console.log('Existing user query result:', { existingUser, fetchError });

    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('User does not exist - creating new user');
      //await createNewDiscordUser(discordUsername, finalUsername);
    } else if (!fetchError && existingUser) {
      console.log('User exists - handling existing user');
      await handleExistingUserDiscord(existingUser, discordUsername, finalUsername);
    } else {
      console.error('Unexpected error:', fetchError);
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in handleDiscordOAuthSuccess:', error);
    showToast("Connected successfully, but couldn't update points. Please refresh!", 'error');
  } finally {
    console.log('Cleaning up session storage...');
    sessionStorage.removeItem('discord_oauth_in_progress');
    sessionStorage.removeItem('primary_username');
  }
};

 //N Updated handleTwitterOAuthSuccess with debug logging
const handleTwitterOAuthSuccess = async (twitterUsername, twitterId) => {
  try {
    console.log('=== handleTwitterOAuthSuccess ===');
    console.log('Twitter username:', twitterUsername);
    console.log('Twitter ID:', twitterId);
    
    const primaryUsername = sessionStorage.getItem('primary_username');
    let finalUsername = primaryUsername || twitterUsername;
    const avatar = session?.user?.image || null; // Use user image if available
    
    console.log('Primary username from session:', primaryUsername);
    console.log('Final username to use:', finalUsername);

    // Check if user exists
    console.log('Checking if user exists in Supabase...');
    const { data: existingUser, error: fetchError } = await supabase
      .from("user_leaderboard")
      .select("*")
      .eq("username", finalUsername)
      .single();

    console.log('Existing user query result:', { existingUser, fetchError });

    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('User does not exist - creating new user');
      //await createNewDiscordUser(discordUsername, finalUsername);
    } else if (!fetchError && existingUser) {
      console.log('User exists - handling existing user');
      await handleExistingUserTwitter(existingUser, twitterUsername, finalUsername, avatar);
    } else {
      console.error('Unexpected error:', fetchError);
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in handleDiscordOAuthSuccess:', error);
    showToast("Connected successfully, but couldn't update points. Please refresh!", 'error');
  } finally {
    console.log('Cleaning up session storage...');
    sessionStorage.removeItem('discord_oauth_in_progress');
    sessionStorage.removeItem('primary_username');
  }
};

// Updated createNewDiscordUser using API
const createNewDiscordUser = async (discordUsername, finalUsername) => {
  try {
    console.log('=== createNewDiscordUser ===');
    console.log('Creating user with data:', {
      discordUsername,
      finalUsername
    });

    const response = await fetch('/api/create-discord-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discordUsername,
        finalUsername
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create Discord user');
    }

    console.log('Discord user created:', data);
    showPointsBadge(50, `Welcome ${discordUsername}! Discord Connected! 🎮`);
    
    // Prompt for server join after a delay
    setTimeout(() => {
      promptDiscordServerJoin(finalUsername, 50);
    }, 2000);

  } catch (error) {
    console.error('Error in createNewDiscordUser:', error);
    throw error;
  }
};


  // 7 Convert handleExistingUserDiscord to use API routes
const handleExistingUserDiscord = async (existingUser, discordUsername, finalUsername) => {
  if (existingUser.discord_connected) {
    // Already connected
    if (existingUser.discord_joined_server) {
      showToast(`Welcome back! You're already connected to Discord! 🎉`, 'success');
    } else {
      // Connected but hasn't joined server
      showToast(`Discord already connected! Want to join our server for +50 points?`, 'info');
      setTimeout(() => {
        promptDiscordServerJoin(finalUsername, existingUser.total_points || 0);
      }, 1000);
    }
  } else {
    // Not connected yet - give connection points using API
    try {
      const response = await fetch('/api/update-discord-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discordUsername,
          finalUsername,
          currentPoints: existingUser.total_points || 0
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update Discord connection');
      }

      showPointsBadge(50, `Discord Connected! +50 Points! 🎮`);
      
      // Prompt for server join
      setTimeout(() => {
        promptDiscordServerJoin(finalUsername, (existingUser.total_points || 0) + 50);
      }, 2000);

    } catch (error) {
      console.error('Error updating Discord connection:', error);
      showToast("Error connecting Discord. Please try again!", 'error');
    }
  }
};

 //10 Updated promptDiscordServerJoin to use API route
const promptDiscordServerJoin = async (username, currentPoints = 0) => {
  const userWantsToJoin = window.confirm(
    `Want to earn +50 more points? 🎮\n\n` +
    "Join our Discord server for:\n" +
    "• Exclusive updates and announcements\n" +
    "• Chat with the community\n" +
    "• Early access to features\n" +
    "• +50 bonus points! 💎\n\n" +
    "Click OK to open Discord and join our server!"
  );

  if (userWantsToJoin) {
    window.open('https://discord.gg/rfmtNCpq', '_blank');
    
    // Give benefit of doubt and award points using API
    try {
      await updateUserDiscordServerStatus(username, currentPoints);
      showPointsBadge(50, "Thanks for joining our Discord! +50 Points! 🎮");
    } catch (error) {
      console.error('Error updating Discord server status:', error);
      showToast("Error updating Discord status. Please try again!", 'error');
    }
  } else {
    showToast("No worries! Join anytime for +50 points! 🎮", 'info');
  }
};

 // 5 Convert updateUserDiscordServerStatus to use API route
const updateUserDiscordServerStatus = async (username, currentPoints = 0) => {
  try {
    const response = await fetch('/api/update-discord-server-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        currentPoints
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update Discord server status');
    }

    console.log('Discord server status updated:', data);
    return data;

  } catch (error) {
    console.error('Error updating Discord server status:', error);
    throw error;
  }
};


  // 8 Convert handleExistingUserTwitter to use API routes
const handleExistingUserTwitter = async (existingUser, twitterUsername, finalUsername, avatar) => {
  if (existingUser.twitter_connected) {
    // Already connected
    if (existingUser.twitter_following) {
      showToast(`Welcome back! You're already Following us on Twitter! 🎉`, 'success');
    } else {
      // Connected but hasn't followed Twitter
      showToast(`Twitter already connected! Want to Follow our Twitter for +100 points?`, 'info');
      setTimeout(() => {
        promptTwitterFollow(finalUsername, existingUser.total_points || 0, avatar);
      }, 1000);
    }
  } else {
    // Not connected yet - give connection points using API
    try {
      const response = await fetch('/api/update-twitter-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          twitterUsername,
          finalUsername,
          currentPoints: existingUser.total_points || 0
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update Twitter connection');
      }

      showPointsBadge(50, `Twitter Connected! +50 Points! 🎮`);
      
      // Prompt for follow
      setTimeout(() => {
        promptTwitterFollow(finalUsername, (existingUser.total_points || 0) + 50);
      }, 2000);

    } catch (error) {
      console.error('Error updating Twitter connection:', error);
      showToast("Error connecting Twitter. Please try again!", 'error');
    }
  }
};

  // 11 Updated promptTwitterFollow to use API route
const promptTwitterFollow = async (username, currentPoints = 0, avatarUrl) => {

  const userWantsToFollow = window.confirm(
    `Hi ${username}! 🎉\n\n` +
    "Want to earn +100 more points?\n" +
    "Follow @AURAinWEB3 on Twitter!\n\n" +
    "Click OK to open Twitter and earn points!"
  );
  
  if (userWantsToFollow) {
    window.open('https://twitter.com/AURAinWEB3', '_blank');
    
    try {
      await updateTwitterFollowStatus(username, currentPoints);
      showPointsBadge(100, "Thanks for following! +100 Points! 🎉");
    } catch (error) {
      console.error('Error updating Twitter follow status:', error);
      showToast("Error updating Twitter status. Please try again!", 'error');
    }
  } else {
    showToast("No worries! Follow us anytime for +100 points! 🐦", 'info');
  }
};


 // 6. Convert updateTwitterFollowStatus to use existing API route
const updateTwitterFollowStatus = async (username, currentPoints = 0) => {
  try {
    const response = await fetch('/api/update-twitter-follow-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        currentPoints
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update follow status');
    }

    console.log('Follow status updated:', data);
    return data;

  } catch (error) {
    console.error('Error updating follow status:', error);
    throw error;
  }
};


  
  
// Update your handleTwitterConnect function
// Simplified Twitter Connect Handler for Community.jsx
const handleTwitterConnect = async () => {
  if (session?.twitter_username ) {
    // User is already connected via NextAuth twitter- check if they've already received points
    const username = session.twitter_username || session.user?.name;
    const avatar = session.user?.image || null; // Get avatar from session if available
    console.log('Handling Twitter connect for user:', username);
    console.log('Handling Twitter connect for user:', session.twitter_username);
    console.log('Handling Twitter connect for user:', session.user?.name);
    try {
      // Check if user exists and has already received Twitter points
      const { data: existingUser, error: fetchError } = await supabase
        .from("user_leaderboard")
        .select("*")
        .eq("twitter_username", username)
        .single();

        console.log('Existing user data:', existingUser);

      if (fetchError && fetchError.code === 'PGRST116') {
        // User doesn't exist - first time connecting
        await handleFirstTimeTwitterConnection(username, avatar);
        console.log('User doesnt exist - first time connecting', username);
      } else if (!fetchError && existingUser) {
        // User exists - check if they've already received Twitter points
        console.log('User exists - check if theyve already received Twitter points', username);
        if (existingUser.twitter_connected && existingUser.twitter_following) {
          // User already received all Twitter-related points
          console.log('User already received all Twitter-related points', username);
          showPointsBadge(0, `Welcome back, ${username}! You're already following us! 🎉`);
        } else if (existingUser.twitter_connected && !existingUser.twitter_following) {
            console.log('User connected but hasnt received follow points yet', username);
          // User connected but hasn't received follow points yet - pass current points
          await giveFollowPoints(username, existingUser.total_points || 0 ,avatar);
        } else {
            console.log('User exists but hasnt connected Twitter yet', username);
          // User exists but hasn't connected Twitter yet
          await handleFirstTimeTwitterConnection(username, avatar);
        }
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      showPointsBadge(0, "Error checking status. Please try refreshing the page!");
    }
  }
  else if(session?.discord_username ) {
    //// Start OAuth flow for new users via Manual Connection
    //Since user is already connected via Discord, we can start the Twitter manual OAuth flow
    console.log('User not connected to Twitter - starting Manual flow');
     sessionStorage.setItem('twitter_oauth_in_progress', 'true');
     // Store primary username if exists (Discord user connecting Twitter)
      const primaryUsername = session?.discord_username || session?.user?.name;
      if (primaryUsername) {
        sessionStorage.setItem('primary_username', primaryUsername);
      }
     window.location.href = "/api/twitter/start";
  }
  else {
    // Start OAuth flow for new users via NextAuth
    //we can start the Twitter OAuth flow
    try {
        console.error(' Start OAuth flow for new users');
         // Set flag to indicate OAuth is in progress
      sessionStorage.setItem('twitter_oauth_in_progress', 'true');
      await signIn("twitter", { 
        callbackUrl: window.location.origin + "/#community" 
      });
    } catch (error) {
      console.error('Error starting Twitter OAuth:', error);
       sessionStorage.removeItem('twitter_oauth_in_progress'); // Clean up on error
      showPointsBadge(0, "Error connecting to Twitter. Please try again!");
    }
  }
};

// // Handle first-time Twitter connection
// const handleFirstTimeTwitterConnection = async (username, avatar) => {
//   const userWantsToFollow = window.confirm(
//     `Hi ${username}! 🎉\n\n` +
//     "Welcome to the Aura community!\n\n" +
//     "Want to earn +150 points?\n" +
//     "• +50 points for connecting Twitter ✅\n" +
//     "• +100 points for following @AURAinWEB3 🐦\n\n" +
//     "Click OK to open Twitter and earn your points!"
//   );
//   console.log('User wants to follow:', userWantsToFollow);
  
//   if (userWantsToFollow) {
//     // Open Twitter in new tab
//     window.open('https://twitter.com/AURAinWEB3', '_blank');
    
//     // Give user benefit of doubt and award full points
//     await syncTwitterUser(username,avatar, true, true); // true for following, true for first time
//     showPointsBadge(150, "Welcome to Aura! Thanks for following! +150 Points! 🎉");
//   } else {
//     // Still give connection points, but not follow points
//     await syncTwitterUser(username,avatar, false, true); // false for following, true for first time
//     showPointsBadge(50, "Twitter Connected! +50 Points! Follow us anytime for +100 more! 🐦");
//   }
// };

// // Give follow points to existing users who haven't received them yet
// const giveFollowPoints = async (username, currentPoints = 0) => {
//   const userWantsToFollow = window.confirm(
//     `Hi ${username}! 👋\n\n` +
//     "Want to earn +100 more points?\n" +
//     "Just follow @AURAinWEB3 on Twitter!\n\n" +
//     "Click OK to open Twitter and earn points!"
//   );
//   console.log('User wants to follow:', userWantsToFollow);
  
//   if (userWantsToFollow) {
//     window.open('https://twitter.com/AURAinWEB3', '_blank');
    
//     // Update user as following and give points (pass current points to avoid extra query)
//     await updateTwitterFollowStatus(username, currentPoints);
//     showPointsBadge(100, "Thanks for following! +100 Points! 🎉");
//   } else {
//     showPointsBadge(0, "No worries! Follow us anytime for +100 points! 🐦");
//   }
// };

// Updated handleFirstTimeTwitterConnection function
const handleFirstTimeTwitterConnection = async (username, avatar) => {
  // Show the modal instead of window.confirm
  setTwitterModal({
    show: true,
    type: 'firstTime',
    username: username,
    avatarUrl: avatar
  });
};

// Updated giveFollowPoints function
const giveFollowPoints = async (username, currentPoints = 0, avatarUrl = '') => {
  // Show the modal instead of window.confirm
  setTwitterModal({
    show: true,
    type: 'existingUser',
    username: username,
    avatarUrl: avatarUrl,
    currentPoints: currentPoints
  });
};

// Handle modal confirm for first time users
const handleFirstTimeConfirm = async () => {
  const { username, avatarUrl } = twitterModal;
  
  // Give user benefit of doubt and award full points
  await syncTwitterUser(username, avatarUrl, true, true); // true for following, true for first time
  showPointsBadge(150, "Welcome to Aura! Thanks for following! +150 Points! 🎉");
};

// Handle modal cancel for first time users  
const handleFirstTimeCancel = async () => {
  const { username, avatarUrl } = twitterModal;
  
  // Still give connection points, but not follow points
  await syncTwitterUser(username, avatarUrl, false, true); // false for following, true for first time
  showPointsBadge(50, "Twitter Connected! +50 Points! Follow us anytime for +100 more! 🐦");
};

// Handle modal confirm for existing users
const handleExistingUserConfirm = async () => {
  const { username, currentPoints } = twitterModal;
  
  // Update user as following and give points
  await updateTwitterFollowStatus(username, currentPoints);
  showPointsBadge(100, "Thanks for following! +100 Points! 🎉");
};

// Handle modal cancel for existing users
const handleExistingUserCancel = () => {
  showPointsBadge(0, "No worries! Follow us anytime for +100 points! 🐦");
};

// Close modal function
const closeTwitterModal = () => {
  setTwitterModal({
    show: false,
    type: null,
    username: '',
    avatarUrl: ''
  });
};

// // Give follow points to existing users who haven't received them yet
// const giveDiscordFollowPoints = async (username, currentPoints = 0) => {
//   const userWantsToJoin = window.confirm(
//     `Hi ${username}! 👋\n\n` +
//     "Want to earn +50 more points?\n" +
//     "Just join our Discord server!\n\n" +
//     "Click OK to open Discord and earn points!"
//   );
//   console.log('User wants to join Discord:', userWantsToJoin);

//   if (userWantsToJoin) {
//     window.open('https://discord.gg/your-discord-invite', '_blank');

//     // Update user as joined server and give points (pass current points to avoid extra query)
//     await updateDiscordFollowStatus(username, currentPoints);
//     showPointsBadge(50, "Thanks for joining Discord! +50 Points! 🎉");
//   } else {
//     showPointsBadge(0, "No worries! Join us anytime for +50 points! 🐦");
//   }
// };

 // 6. Convert updateTwitterFollowStatus to use existing API route
const updateDiscordFollowStatus = async (username, currentPoints = 0) => {
  try {
    const response = await fetch('/api/update-discord-server-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        currentPoints
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update follow status');
    }

    console.log('Follow status updated:', data);
    return data;

  } catch (error) {
    console.error('Error updating follow status:', error);
    throw error;
  }
};



// 9 Convert handleDailyCheckin to use API route
const handleDailyCheckin = async () => {
  const loaderId = 'daily-checkin';
  const manager = loadingManager.current; // Access the ref-based manager
  
  try {
    manager.showLoading(loaderId, 'Doing check-in, please wait... ⏳');
    
    const username = getUsernameFromSession();
    console.log('Handling daily check-in for user:', username);
    
    if (!username) {
      manager.hideLoading(loaderId);
      showPointsBadge(0, `Connect with X or Discord to earn Points!!!`);
      showToast("Connect with X or Discord to earn Points!!!", "error");
      return;
    }

    manager.updateMessage(loaderId, 'Connecting to server... 🌐');

    const response = await fetch('/api/daily-checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    });

    manager.updateMessage(loaderId, 'Processing your check-in... ⚡');

    const data = await response.json();

    if (!response.ok) {
      manager.hideLoading(loaderId);
      
      if (data.alreadyCheckedIn) {
        showToast(data.message, "info");
        showPointsBadge(0, data.message);
        return;
      }
      throw new Error(data.error || 'Failed to complete daily check-in');
    }

    // Handle successful response
    if (data.alreadyCheckedIn) {
      manager.hideLoading(loaderId);
      showPointsBadge(0, data.message);
      showToast(data.message, "info");
      return;
    }

    if (data.success) {
      manager.updateMessage(loaderId, 'Check-in successful! 🎉');
      
      setTimeout(() => {
        manager.hideLoading(loaderId);
        showPointsBadge(data.points, `Daily Check-in Complete! 🔥 ${data.streak} day streak!`);
      }, 800);
      
      showToast(`+${data.points} points earned! ${data.streak} day streak!`, "success");
    }

  } catch (error) {
    console.error('Error during daily checkin:', error);
    manager.hideLoading(loaderId);
    
    // Handle specific error types
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      showToast("Network error - please check your connection", "error");
    } else if (error.message.includes('Failed to fetch')) {
      showToast("Unable to connect to server", "error");
    } else {
      showToast(error.message || "An unexpected error occurred during check-in", "error");
    }
  }
};




  const handlePostSubmit = async (formData) => {
  try {
    // Get current user (you'll need to implement this based on your auth system)
    const username = getUsernameFromSession(); // Replace with your actual user retrieval method
    console.log('Handling post for user', username);
    
    if (!username) {
      setShowPostModal(false);
      showPointsBadge(0, `Connect with X or Discord to submit posts!!!`);
      showToast("Connect with X or Discord to submit posts!!!", "error");
      return;
    }

    // Call the server-side API endpoint
    const response = await fetch('/api/submit-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        username
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to submit post');
    }

    if (result.success) {
      setShowPostModal(false);
      // Replace showPointsBadge with celebration popup
      setShowCelebration(true);
      // Optional: refresh posts if needed
      // fetchCommunityPosts(true);
    }

  } catch (error) {
    console.error('Error submitting post:', error);
    showToast(error.message || "Error submitting post. Please try again.", "error");
  }
};

// Helper function to check if user has a valid session
const hasValidSession = () => {
  return session && (
    session.twitter_username || 
    session.discord_username || 
    session.user?.name
  );
};

// Updated action handler for the GameActionCard
const handlePostAction = () => {
  if (!hasValidSession()) {
    showPointsBadge(0, `Connect with X or Discord to submit posts!!!`);
    return;
  }
  setShowPostModal(true);
};

// Updated action handler for the GameActionCard
const handleGameAction = () => {
  showPointsBadge(0, `Coming soon! Stay tuned for updates!`);
};

  const fetchCommunityPosts = async (reset = false) => {
    if (loading) return;
    
    setLoading(true);
    const currentOffset = reset ? 0 : offset;
    
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + 9);

      if (error) throw error;

      if (reset) {
        setCommunityPosts(data || []);
        setOffset(10);
      } else {
        setCommunityPosts(prev => [...prev, ...(data || [])]);
        setOffset(prev => prev + 10);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityPosts(true);
  }, []);

  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;
    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      fetchCommunityPosts();
    }
  };

   // Test button to trigger celebration
  const testCelebration = () => {
    setShowCelebration(true);
  };

  

return (
  <>

   <LoadingOverlay 
        isVisible={loadingState.isVisible} 
        message={loadingState.message} 
      />
      
    {/* Add Toast component */}
    <Toast 
      show={toast.show} 
      message={toast.message} 
      type={toast.type}
      onClose={() => setToast({ ...toast, show: false })} 
    />

    <BadgeAnimation 
      show={showBadge} 
      points={badgeData.points}
      message={badgeData.message}
      onComplete={() => setShowBadge(false)}
    />
    
    <PostModal 
      isOpen={showPostModal}
      onClose={() => setShowPostModal(false)}
      onSubmit={handlePostSubmit}
      session={session}
    />

    {twitterModal.show && (
  <TwitterModal
    type={twitterModal.type}
    username={twitterModal.username}
    avatarUrl={twitterModal.avatarUrl}
    onClose={closeTwitterModal}
    onConfirm={
      twitterModal.type === 'firstTime' 
        ? handleFirstTimeConfirm 
        : handleExistingUserConfirm
    }
    onCancel={
      twitterModal.type === 'firstTime' 
        ? handleFirstTimeCancel 
        : handleExistingUserCancel
    }
  />
)}

{discordModal.show && (
  <DiscordModal
    type={discordModal.type}
    username={discordModal.username}
    avatarUrl={discordModal.avatarUrl}
    onClose={closeDiscordModal}
    onConfirm={
      discordModal.type === 'firstTime' 
        ? handleDiscordFirstTimeConfirm 
        : handleDiscordExistingUserConfirm
    }
    onCancel={
      discordModal.type === 'firstTime' 
        ? handleDiscordFirstTimeCancel 
        : handleDiscordExistingUserCancel
    }
  />
)}

    {/* ADD THIS: Celebration Popup Component */}
    <CelebrationPopup
      show={showCelebration}
      message="Post submitted for review! Points coming your way!"
      variant="text" // or "bubble" - try both and see which you prefer
      onComplete={() => setShowCelebration(false)} // This closes the popup
    />

    {/* Comic Book Style Background Container */}
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      {/* Animated Comic Book Dots Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="comic-dot absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Comic Book Title Panel */}
        <div 
          ref={titlePanelRef}
          className="relative w-fit mx-auto mb-16"
        >
          {/* White background comic panel */}
          <div className="bg-white p-8 rounded-2xl border-8 border-black shadow-2xl skew-x-[-15deg]">
            {/* Inner purple panel */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-xl border-4 border-black relative overflow-hidden">
              {/* Comic dots pattern */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="comic-dot absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
              <h2 className="text-white text-6xl font-black font-comic tracking-wider skew-x-[15deg] relative z-10">
                COMMUNITY
              </h2>
            </div>
          </div>
        </div>

        {/* Description Panel */}
        <div ref={descriptionPanelRef} className="bg-white p-6 rounded-2xl border-8 border-black shadow-2xl mb-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl border-4 border-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="comic-dots"></div>
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-white text-xl font-bold font-comic text-center">
                BREAK THE CODE TOGETHER.
              </p>
              <p className="text-white text-lg leading-relaxed">
                Aura isn't just a project, it's a movement.
                The community isn't the background, it's the engine.
              </p>
              <p className="text-white text-lg leading-relaxed">
                Earn your place, shape the story, and make your Aura seen.
              </p>
            </div>
          </div>
        </div>

        {/* Test Buttons Panel */}
        <div className="flex justify-center gap-4 mb-12">
          <div className="bg-white p-2 rounded-xl border-4 border-black shadow-xl">
            <SignOutButton/>
          </div>
          <div className="bg-white p-2 rounded-xl border-4 border-black shadow-xl">
            <button 
              onClick={testCelebration}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg border-4 border-black font-comic font-bold shadow-lg hover:scale-105 transition-transform"
            >
              🎉 TEST CELEBRATION
            </button>
          </div>
        </div>

     {/* Game Action Cards - Comic Book Style */}
      <div className="max-w-6xl mx-auto md:px-4 space-y-12">
        
        {/* Daily Check-In Card */}
        <div className="bg-white p-1 md:p-6 rounded-2xl border-2 md:border-8 border-black shadow-2xl">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl border-2 md:border-4 border-black relative overflow-hidden">
            {/* Comic dots pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="comic-dot absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="flex flex-col lg:grid lg:grid-cols-2 relative z-10">
              {/* Content Section */}
              <div className="p-3 md:p-8 flex flex-col justify-center order-1 lg:order-1">
                <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                  <span className="text-2xl md:text-6xl">🔹</span>
                  <h3 className="text-lg md:text-4xl font-black text-white font-comic leading-tight">DAILY CHECK-IN</h3>
                </div>
                <p className="text-white text-sm md:text-lg mb-3 md:mb-6 leading-relaxed">
                  Show up daily. Earn progress on the leaderboard. Get closer to whitelist and personalized 3D avatar.
                </p>
                <button 
                  onClick={handleDailyCheckin}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-3 md:px-8 py-2 md:py-4 rounded-lg border-2 md:border-4 border-black shadow-xl font-comic text-sm md:text-xl hover:scale-105 transition-transform w-fit"
                >
                  ✅ CHECK IN
                </button>
              </div>
              
              {/* Image Section */}
              <div className="relative card-image order-2 lg:order-2 min-h-[250px] md:min-h-[300px] lg:min-h-[500px]">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-r-none lg:rounded-r-lg"
                  style={{
                    backgroundImage: `url('/sup4.png')`,
                    minHeight: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero vs Villain Card */}
        <div className="bg-white p-1 md:p-6 rounded-2xl border-2 md:border-8 border-black shadow-2xl">
          <div className="bg-gradient-to-br from-red-500 to-amber-500 rounded-xl border-2 md:border-4 border-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="comic-dot absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="flex flex-col lg:grid lg:grid-cols-2 relative z-10">
              {/* Image Section - First on mobile */}
              <div className="relative card-image order-1 lg:order-1 min-h-[250px] md:min-h-[300px] lg:min-h-[500px]">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-l-none lg:rounded-l-lg"
                  style={{
                    backgroundImage: `url('/aura-poster-2.png')`,
                    minHeight: 'inherit'
                  }}
                />
              </div>
              
              {/* Content Section */}
              <div className="p-3 md:p-8 flex flex-col justify-center order-2 lg:order-2">
                <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                  <span className="text-2xl md:text-6xl">⚔️</span>
                  <h3 className="text-lg md:text-4xl font-black text-white font-comic leading-tight">HERO VS VILLAIN</h3>
                </div>
                <p className="text-white text-sm md:text-lg mb-3 md:mb-6 leading-relaxed">
                  Your voice shapes the weekly battle. Weekly battle shapes history.
                </p>
                <button 
                  onClick={handleGameAction}
                  className="bg-red-500 hover:bg-red-400 text-white font-black px-3 md:px-8 py-2 md:py-4 rounded-lg border-2 md:border-4 border-black shadow-xl font-comic text-sm md:text-xl hover:scale-105 transition-transform w-fit"
                >
                  🗳️ CAST VOTE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Post Your Aura Card */}
        <div className="bg-white p-1 md:p-6 rounded-2xl border-2 md:border-8 border-black shadow-2xl">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500  rounded-xl border-2 md:border-4 border-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="comic-dot absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="flex flex-col lg:grid lg:grid-cols-2 relative z-10">
              {/* Content Section */}
              <div className="p-3 md:p-8 flex flex-col justify-center order-1 lg:order-1">
                <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                  <span className="text-2xl md:text-6xl">✨</span>
                  <h3 className="text-lg md:text-4xl font-black text-white font-comic leading-tight">POST YOUR AURA</h3>
                </div>
                <p className="text-white text-sm md:text-lg mb-3 md:mb-6 leading-relaxed">
                  Tell your story. Get featured. Earn rewards for quality content.
                </p>
                <button 
                  onClick={handlePostAction}
                  className="bg-blue-400 hover:bg-blue-300 text-black font-black px-3 md:px-8 py-2 md:py-4 rounded-lg border-2 md:border-4 border-black shadow-xl font-comic text-sm md:text-xl hover:scale-105 transition-transform w-fit"
                >
                  📝 SUBMIT POST
                </button>
              </div>
              
              {/* Image Section */}
              <div className="relative card-image order-2 lg:order-2 min-h-[250px] md:min-h-[300px] lg:min-h-[500px]">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-r-none lg:rounded-r-lg"
                  style={{
                    backgroundImage: `url('/heavn_poster.png')`,
                    minHeight: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Follow on Twitter Card */}
        <div className="bg-white p-1 md:p-6 rounded-2xl border-2 md:border-8 border-black shadow-2xl">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl border-2 md:border-4 border-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="comic-dot absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="flex flex-col lg:grid lg:grid-cols-2 relative z-10">
              {/* Image Section - First on mobile */}
              <div className="relative card-image order-1 lg:order-1 min-h-[250px] md:min-h-[300px] lg:min-h-[500px]">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-l-none lg:rounded-l-lg"
                  style={{
                    backgroundImage: `url('/Ximg.png')`,
                    minHeight: 'inherit'
                  }}
                />
              </div>
              
              {/* Content Section */}
              <div className="p-3 md:p-8 flex flex-col justify-center order-2 lg:order-2">
                <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                  <span className="text-2xl md:text-6xl">𝕏</span>
                  <h3 className="text-lg md:text-4xl font-black text-white font-comic leading-tight">FOLLOW ON TWITTER</h3>
                </div>
                <p className="text-white text-sm md:text-lg mb-3 md:mb-6 leading-relaxed">
                  Stay in the loop, vote in battles, share the energy.
                </p>
                <button 
                  onClick={handleTwitterConnect}
                  className="bg-green-400 hover:bg-green-300 text-black font-black px-3 md:px-8 py-2 md:py-4 rounded-lg border-2 md:border-4 border-black shadow-xl font-comic text-sm md:text-xl hover:scale-105 transition-transform w-fit"
                >
                  🔗 FOLLOW ON 𝕏
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Join Discord Card */}
        <div className="bg-white p-1 md:p-6 rounded-2xl border-2 md:border-8 border-black shadow-2xl">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl border-2 md:border-4 border-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="comic-dot absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="flex flex-col lg:grid lg:grid-cols-2 relative z-10">
              {/* Content Section */}
              <div className="p-3 md:p-8 flex flex-col justify-center order-1 lg:order-1">
                <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                  <div className="w-6 h-6 md:w-16 md:h-16 bg-black rounded-full p-1 md:p-2 border-2 md:border-4 border-black flex items-center justify-center">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-4xl font-black text-white font-comic leading-tight">JOIN DISCORD</h3>
                </div>
                <p className="text-white text-sm md:text-lg mb-3 md:mb-6 leading-relaxed">
                  Talk, share, learn and get early updates and opportunities.
                </p>
                <button 
                  onClick={handleDiscordConnect}
                  className="bg-indigo-400 hover:bg-indigo-300 text-black font-black px-3 md:px-8 py-2 md:py-4 rounded-lg border-2 md:border-4 border-black shadow-xl font-comic text-sm md:text-xl hover:scale-105 transition-transform w-fit"
                >
                  🔗 JOIN NOW
                </button>
              </div>
              
              {/* Image Section */}
              <div className="relative card-image order-2 lg:order-2 min-h-[250px] md:min-h-[300px] lg:min-h-[500px]">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-r-none lg:rounded-r-lg"
                  style={{
                    backgroundImage: `url('/discordimg.png')`,
                    minHeight: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Featured from the Community - Comic Book Style */}
        <div className="mt-20">
          {/* Comic Book Title Panel */}
          <div ref={communityTitleRef} className="bg-white p-6 rounded-2xl border-8 border-black shadow-2xl mb-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-xl border-4 border-black relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="comic-dots"></div>
              </div>
              <h2 className="text-black text-4xl font-black mb-4 text-center font-comic relative z-10">
                FEATURED FROM THE COMMUNITY
              </h2>
              <p className="text-black text-xl text-center font-bold font-comic relative z-10">
                Real people. Real auras. Real stories.
              </p>
            </div>
          </div>
          
          {/* Community Posts Scroll Container */}
         <div 
          className="flex overflow-x-auto pb-4 gap-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#bf52de #1a1a1a' }}
        >
          {communityPosts.map((post, index) => (
            <CommunityCard key={post.id || index} post={post} />
          ))}
          
          {loading && (
            <div className="min-w-[300px] flex items-center justify-center bg-gray-800 rounded-2xl mx-2">
              <div className="text-white">Loading...</div>
            </div>
          )}
        </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-8">
            <div ref={el => actionButtonsRef.current[0] = el} className="bg-white p-2 rounded-xl border-4 border-black shadow-xl">
              <button
                onClick={() => fetchCommunityPosts(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-lg border-4 border-black font-comic font-bold text-xl shadow-lg hover:scale-105 transition-transform"
              >
                🔄 SEE MORE POSTS
              </button>
            </div>
            <div ref={el => actionButtonsRef.current[1] = el} className="bg-white p-2 rounded-xl border-4 border-black shadow-xl">
              <button
                onClick={() => setShowPostModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg border-4 border-black font-comic font-bold text-xl shadow-lg hover:scale-105 transition-transform"
              >
                ✨ SUBMIT YOURS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS with animations - matching About.jsx */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Creepster&family=Fredoka+One:wght@400&display=swap');
        
        .font-comic {
          font-family: 'Bangers', 'Fredoka One', cursive;
          letter-spacing: 0.05em;
        }
        
        /* Enhanced comic book halftone effect */
        .comic-dots {
          background-image: 
            radial-gradient(circle at 25% 25%, #fff 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px);
          background-size: 20px 20px, 15px 15px;
          background-position: 0 0, 10px 10px;
          animation: dotShift 4s ease-in-out infinite;
        }
        
        .comic-dot {
          animation: dotFloat 3s ease-in-out infinite;
        }
        
        @keyframes dotShift {
          0%, 100% { background-position: 0 0, 10px 10px; }
          50% { background-position: 5px 5px, 15px 15px; }
        }
        
        @keyframes dotFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-5px) scale(1.1); opacity: 0.6; }
        }
        
        /* Button press animation */
        .btn-press {
          animation: buttonPress 0.2s ease-in-out;
        }
        
        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #bf52de;
          border-radius: 4px;
          border: 2px solid #000;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #d946ef;
        }
      `}</style>
    </div>
  </>
);
};

export default SectionWrapper(Community, "community");