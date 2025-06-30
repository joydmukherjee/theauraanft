import React, { useState, useEffect } from "react";
import Link from "next/link";
import Tilt from "react-tilt";
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

const PostModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    post_text: '',
    twitter_post_url: '',
    photo_url: '',
    avatar_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.post_text || !formData.avatar_url) {
      alert('Please fill in all required fields');
      return;
    }
    
    await onSubmit(formData);
    setFormData({ username: '', post_text: '', twitter_post_url: '', photo_url: '', avatar_url: '' });
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
          <div>
            <label className="block text-white font-semibold mb-2">Username *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-purple-500 focus:border-pink-500 focus:outline-none"
              placeholder="@yourusername"
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-semibold mb-2">Avatar URL *</label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-purple-500 focus:border-pink-500 focus:outline-none"
              placeholder="https://example.com/avatar.jpg"
              required
            />
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
            <label className="block text-white font-semibold mb-2">Twitter Post URL (Optional)</label>
            <input
              type="url"
              value={formData.twitter_post_url}
              onChange={(e) => setFormData({...formData, twitter_post_url: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border-2 border-purple-500 focus:border-pink-500 focus:outline-none"
              placeholder="https://twitter.com/user/status/..."
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
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="min-w-[300px] bg-gradient-to-br from-gray-900 to-purple-900 p-6 rounded-2xl border-2 border-purple-500 shadow-xl mx-2"
    >
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={post.avatar_url} 
          alt={post.username}
          className="w-12 h-12 rounded-full border-2 border-purple-400"
        />
        <div>
          <h4 className="text-white font-bold">{post.username}</h4>
          <p className="text-gray-400 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      
      <p className="text-white mb-4 line-clamp-3">"{post.post_text}"</p>
      
      {post.photo_url && (
        <img 
          src={post.photo_url} 
          alt="User post"
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}
      
      {post.twitter_post_url && (
        <GameButton 
          onClick={() => window.open(post.twitter_post_url, '_blank')}
          variant="secondary"
          className="w-full text-sm"
        >
          🐦 View on Twitter
        </GameButton>
      )}
    </motion.div>
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

const CommunityV2 = () => {
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
            await handleFirstTimeTwitterConnection(username, true); // true = is callback
          } else if (provider === 'discord') {
            await handleFirstTimeDiscordConnection(username, true); // true = is callback
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
const syncTwitterUser = async (twitterUsername, isFollowing = false, isFirstTime = false) => {
  try {
    console.log("Syncing Twitter user:", twitterUsername, "Following:", isFollowing, "First time:", isFirstTime);
    
    if (isFirstTime) {
      // For first-time users, create new entry
      const initialPoints = isFollowing ? 150 : 50;
      
      const { error: insertError } = await supabase
        .from("user_leaderboard")
        .insert([{
          username: twitterUsername,
          twitter_connected: true,
          twitter_username: twitterUsername,
          total_points: initialPoints,
          twitter_following: isFollowing
        }]);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      // Add transaction records
      const transactions = [{
        username: twitterUsername,
        activity_type: "twitter_connect",
        points_earned: 50,
        description: "Connected Twitter account",
      }];

      if (isFollowing) {
        transactions.push({
          username: twitterUsername,
          activity_type: "twitter_follow",
          points_earned: 100,
          description: "Following on Twitter",
        });
      }

      await supabase.from("point_transactions").insert(transactions);

    } else {
      // For existing users, just update follow status if needed
      // First get current points
      const { data: currentUser, error: fetchCurrentError } = await supabase
        .from("user_leaderboard")
        .select("total_points")
        .eq("username", twitterUsername)
        .single();

      if (fetchCurrentError) throw fetchCurrentError;

      const { error: updateError } = await supabase
        .from("user_leaderboard")
        .update({
          twitter_following: isFollowing,
          total_points: (currentUser.total_points || 0) + 100
        })
        .eq("username", twitterUsername)
        .eq("twitter_following", false); // Only update if not already following

      if (updateError) throw updateError;

      // Add follow transaction
      await supabase.from("point_transactions").insert([{
        username: twitterUsername,
        activity_type: "twitter_follow",
        points_earned: 100,
        description: "Following on Twitter",
      }]);
    }

  } catch (error) {
    console.error('Error syncing Twitter user:', error);
    showPointsBadge(0, "Connection successful, but couldn't update points. Please refresh!");
  }
};

// Update your syncDiscordUser function
// Updated syncDiscordUser function with better duplicate prevention
const syncDiscordUser = async (discordUsername, isFollowing = false, isFirstTime = false) => {
  try {
    console.log("Syncing Twitter user:", discordUsername, "Following:", isFollowing, "First time:", isFirstTime);
    
    if (isFirstTime) {
      // For first-time users, create new entry
      const initialPoints = isFollowing ? 100 : 50;
      
      const { error: insertError } = await supabase
        .from("user_leaderboard")
        .insert([{
          username: discordUsername,
          discord_connected: true,
          discord_username: discordUsername,
          total_points: initialPoints,
          discord_joined_server: isFollowing
        }]);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      // Add transaction records
      const transactions = [{
        username: discordUsername,
        activity_type: "discord_connect",
        points_earned: 50,
        description: "Connected discord account",
      }];

      if (isFollowing) {
        transactions.push({
          username: discordUsername,
          activity_type: "discord_join_server",
          points_earned: 50,
          description: "Joined Discord server",
        });
      }

      await supabase.from("point_transactions").insert(transactions);

    } else {
      // For existing users, just update follow status if needed
      // First get current points
      const { data: currentUser, error: fetchCurrentError } = await supabase
        .from("user_leaderboard")
        .select("total_points")
        .eq("username", discordUsername)
        .single();

      if (fetchCurrentError) throw fetchCurrentError;

      const { error: updateError } = await supabase
        .from("user_leaderboard")
        .update({
          discord_joined_server: isFollowing,
          total_points: (currentUser.total_points || 0) + 100
        })
        .eq("username", discordUsername)
        .eq("discord_joined_server", false); // Only update if not already following

      if (updateError) throw updateError;

      // Add follow transaction
      await supabase.from("point_transactions").insert([{
        username: discordUsername,
        activity_type: "discord_join_server",
        points_earned: 50,
        description: "joined Discord server",
      }]);
    }

  } catch (error) {
    console.error('Error syncing Twitter user:', error);
    showPointsBadge(0, "Connection successful, but couldn't update points. Please refresh!");
  }
};

 

   // Simplified handleDiscordConnect
  const handleDiscordConnect = async () => {
    // Check if user is already connected to Discord via NextAuth
    if (session?.discord_username ) {
    // User is already connected - check if they've already received points
    const username = session.discord_username || session.user?.name;
    console.log('Handling Discord connect for user:', username);
    console.log('Handling Discord connect for user:', session.discord_username);
    console.log('Handling Discord connect for user:', session.user?.name);
    try {
      // Check if user exists and has already received Discord points
      const { data: existingUser, error: fetchError } = await supabase
        .from("user_leaderboard")
        .select("*")
        .eq("discord_username", username)
        .single();

        console.log('Existing user data:', existingUser);

      if (fetchError && fetchError.code === 'PGRST116') {
        // User doesn't exist - first time connecting
        await handleFirstTimeDiscordConnection(username);
        console.log('User doesnt exist - first time connecting', username);
      } else if (!fetchError && existingUser) {
        // User exists - check if they've already received Discord points
        console.log('User exists - check if theyve already received Discord points', username);
        if (existingUser.discord_connected && existingUser.discord_following) {
          // User already received all Twitter-related points
          console.log('User already received all Discord-related points', username);
          showPointsBadge(0, `Welcome back, ${username}! You're already following us! 🎉`);
        } else if (existingUser.discord_connected && !existingUser.discord_following) {
            console.log('User connected but hasnt received follow points yet', username);
          // User connected but hasn't received follow points yet - pass current points
          await giveDiscordFollowPoints(username, existingUser.total_points || 0);
        } else {
            console.log('User exists but hasnt connected Twitter yet', username);
          // User exists but hasn't connected Twitter yet
          await handleFirstTimeDiscordConnection(username);
        }
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      showPointsBadge(0, "Error checking status. Please try refreshing the page!");
    }
  } 
  else if(session?.twitter_username ) {
    //// Start OAuth flow for new users via Manual Connection
    //Since user is already connected via twitter, we can start the discord manual OAuth flow
    console.log('User not connected to Discord - starting Manual flow');
     try {
      sessionStorage.setItem('discord_oauth_in_progress', 'true');
      
      // Store primary username if exists (Twitter user connecting Discord)
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
    // No session - start Discord OAuth
      try {
        sessionStorage.setItem('discord_oauth_in_progress', 'true');
        await signIn("discord", { 
          callbackUrl: window.location.origin + "/#communityv2" 
        });
      } catch (error) {
        console.error('Error starting Discord OAuth:', error);
        sessionStorage.removeItem('discord_oauth_in_progress');
        showToast("Error connecting to Discord. Please try again!", 'error');
      }

  }
};

  // Handle first-time Twitter connection
const handleFirstTimeDiscordConnection = async (username, isCallback=false) => {
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
      //await updateDiscordServerStatus(username, currentPoints);
       // Give user benefit of doubt and award full points
    await syncDiscordUser(username, true, true); // true for following, true for first time
    showPointsBadge(50, "Welcome to Aura! Thanks for following! +50 Points! 🎉");
  } else {
    // Still give connection points, but not follow points
    await syncDiscordUser(username, false, true); // false for following, true for first time
    showPointsBadge(50, "Discord Connected! +50 Points! Follow us anytime for +50 more! 🐦");
  }
    

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

 // Updated handleDiscordOAuthSuccess with debug logging
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

 // Updated handleTwitterOAuthSuccess with debug logging
const handleTwitterOAuthSuccess = async (twitterUsername, twitterId) => {
  try {
    console.log('=== handleTwitterOAuthSuccess ===');
    console.log('Twitter username:', twitterUsername);
    console.log('Twitter ID:', twitterId);
    
    const primaryUsername = sessionStorage.getItem('primary_username');
    let finalUsername = primaryUsername || twitterUsername;
    
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
      await handleExistingUserTwitter(existingUser, twitterUsername, finalUsername);
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

// Updated createNewDiscordUser with debug logging
const createNewDiscordUser = async (discordUsername, finalUsername) => {
  try {
    console.log('=== createNewDiscordUser ===');
    console.log('Creating user with data:', {
      username: finalUsername,
      discord_username: discordUsername,
      discord_connected: true,
      total_points: 50
    });

    const { data: insertData, error: insertError } = await supabase
      .from("user_leaderboard")
      .insert([{
        username: finalUsername,
        discord_username: discordUsername,
        discord_connected: true,
        total_points: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(); // Add select to return inserted data

    console.log('Insert result:', { insertData, insertError });

    if (insertError) {
      console.error('Insert error details:', insertError);
      throw insertError;
    }

    // Add transaction
    console.log('Adding transaction record...');
    const { data: transactionData, error: transactionError } = await supabase
      .from("point_transactions")
      .insert([{
        username: finalUsername,
        activity_type: "discord_connect",
        points_earned: 50,
        description: "Connected Discord account",
      }])
      .select();

    console.log('Transaction result:', { transactionData, transactionError });

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      // Don't throw here, just log - user creation was successful
    }

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

  // Handle existing user Discord connection
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
      // Not connected yet - give connection points
      showPointsBadge(50, `Discord Connected! +50 Points! 🎮`);
      const { error: updateError } = await supabase
        .from("user_leaderboard")
        .update({
          discord_username: discordUsername,
          discord_connected: true,
          total_points: (existingUser.total_points || 0) + 50,
          updated_at: new Date().toISOString()
        })
        .eq("username", finalUsername);

      if (updateError) throw updateError;

      // Add transaction
      await supabase.from("point_transactions").insert([{
        username: finalUsername,
        activity_type: "discord_connect",
        points_earned: 50,
        description: "Connected Discord account",
      }]);

      
      
      // Prompt for server join
      setTimeout(() => {
        promptDiscordServerJoin(finalUsername, (existingUser.total_points || 0) + 50);
      }, 2000);
    }
  };

  // Prompt user to join Discord server
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
      
      // Give benefit of doubt and award points
      await updateUserDiscordServerStatus(username, currentPoints);
      showPointsBadge(50, "Thanks for joining our Discord! +50 Points! 🎮");
    } else {
      showToast("No worries! Join anytime for +50 points! 🎮", 'info');
    }
  };

  // Update Discord server join status
  const updateUserDiscordServerStatus = async (username, currentPoints = 0) => {
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

    // Handle existing user Discord connection
  const handleExistingUserTwitter = async (existingUser, twitterUsername, finalUsername) => {
    if (existingUser.twitter_connected) {
      // Already connected
      if (existingUser.twitter_following) {
        showToast(`Welcome back! You're already Following us on Twitter! 🎉`, 'success');
      } else {
        // Connected but hasn't followed Twitter
        showToast(`Twitter already connected! Want to Follow our Twitter for +100 points?`, 'info');
        setTimeout(() => {
          promptTwitterFollow(finalUsername, existingUser.total_points || 0);
        }, 1000);
      }
    } else {
      // Not connected yet - give connection points
      showPointsBadge(50, `Twitter Connected! +50 Points! 🎮`);
      const { error: updateError } = await supabase
        .from("user_leaderboard")
        .update({
          twitter_username: twitterUsername,
          twitter_connected: true,
          total_points: (existingUser.total_points || 0) + 50,
          updated_at: new Date().toISOString()
        })
        .eq("username", finalUsername);

      if (updateError) throw updateError;

      // Add transaction
      await supabase.from("point_transactions").insert([{
        username: finalUsername,
        activity_type: "twitter_connect",
        points_earned: 50,
        description: "Connected Twitter account",
      }]);

      
      
      // Prompt for server join
      setTimeout(() => {
        promptTwitterFollow(finalUsername, (existingUser.total_points || 0) + 50);
      }, 2000);
    }
  };

  // Prompt user to Follow Twitter
  const promptTwitterFollow = async (username, currentPoints = 0) => {
    const userWantsToFollow = window.confirm(
      `Hi ${username}! 🎉\n\n` +
      "Want to earn +100 more points?\n" +
      "Follow @AURAinWEB3 on Twitter!\n\n" +
      "Click OK to open Twitter and earn points!"
    );
    
    if (userWantsToFollow) {
      window.open('https://twitter.com/AURAinWEB3', '_blank');
      await updateTwitterFollowStatus(username, currentPoints);
      showPointsBadge(100, "Thanks for following! +100 Points! 🎉");
    } else {
      showToast("No worries! Follow us anytime for +100 points! 🐦", 'info');
    }

  };

   // Update Twitter follow status
  const updateTwitterFollowStatus = async (username, currentPoints = 0) => {
    try {
      const { error: updateError } = await supabase
        .from("user_leaderboard")
        .update({
          twitter_following: true,
          total_points: currentPoints + 100
        })
        .eq("username", username);

      if (updateError) throw updateError;

      await supabase.from("point_transactions").insert([{
        username: username,
        activity_type: "twitter_follow",
        points_earned: 100,
        description: "Following on Twitter",
      }]);

    } catch (error) {
      console.error('Error updating Twitter follow status:', error);
      throw error;
    }
  };

  
  
// Update your handleTwitterConnect function
// Simplified Twitter Connect Handler for CommunityV1.jsx
const handleTwitterConnect = async () => {
  if (session?.twitter_username ) {
    // User is already connected via NextAuth twitter- check if they've already received points
    const username = session.twitter_username || session.user?.name;
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
        await handleFirstTimeTwitterConnection(username);
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
          await giveFollowPoints(username, existingUser.total_points || 0);
        } else {
            console.log('User exists but hasnt connected Twitter yet', username);
          // User exists but hasn't connected Twitter yet
          await handleFirstTimeTwitterConnection(username);
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
    try {
        console.error(' Start OAuth flow for new users');
         // Set flag to indicate OAuth is in progress
      sessionStorage.setItem('twitter_oauth_in_progress', 'true');
      await signIn("twitter", { 
        callbackUrl: window.location.origin + "/#communityv2" 
      });
    } catch (error) {
      console.error('Error starting Twitter OAuth:', error);
       sessionStorage.removeItem('twitter_oauth_in_progress'); // Clean up on error
      showPointsBadge(0, "Error connecting to Twitter. Please try again!");
    }
  }
};

// Handle first-time Twitter connection
const handleFirstTimeTwitterConnection = async (username) => {
  const userWantsToFollow = window.confirm(
    `Hi ${username}! 🎉\n\n` +
    "Welcome to the Aura community!\n\n" +
    "Want to earn +150 points?\n" +
    "• +50 points for connecting Twitter ✅\n" +
    "• +100 points for following @AURAinWEB3 🐦\n\n" +
    "Click OK to open Twitter and earn your points!"
  );
  console.log('User wants to follow:', userWantsToFollow);
  
  if (userWantsToFollow) {
    // Open Twitter in new tab
    window.open('https://twitter.com/AURAinWEB3', '_blank');
    
    // Give user benefit of doubt and award full points
    await syncTwitterUser(username, true, true); // true for following, true for first time
    showPointsBadge(150, "Welcome to Aura! Thanks for following! +150 Points! 🎉");
  } else {
    // Still give connection points, but not follow points
    await syncTwitterUser(username, false, true); // false for following, true for first time
    showPointsBadge(50, "Twitter Connected! +50 Points! Follow us anytime for +100 more! 🐦");
  }
};

// Give follow points to existing users who haven't received them yet
const giveFollowPoints = async (username, currentPoints = 0) => {
  const userWantsToFollow = window.confirm(
    `Hi ${username}! 👋\n\n` +
    "Want to earn +100 more points?\n" +
    "Just follow @AURAinWEB3 on Twitter!\n\n" +
    "Click OK to open Twitter and earn points!"
  );
  console.log('User wants to follow:', userWantsToFollow);
  
  if (userWantsToFollow) {
    window.open('https://twitter.com/AURAinWEB3', '_blank');
    
    // Update user as following and give points (pass current points to avoid extra query)
    await updateUserFollowStatus(username, currentPoints);
    showPointsBadge(100, "Thanks for following! +100 Points! 🎉");
  } else {
    showPointsBadge(0, "No worries! Follow us anytime for +100 points! 🐦");
  }
};

// Give follow points to existing users who haven't received them yet
const giveDiscordFollowPoints = async (username, currentPoints = 0) => {
  const userWantsToFollow = window.confirm(
    `Hi ${username}! 👋\n\n` +
    "Want to earn +50 more points?\n" +
    "Just Join our Discord server!\n\n" +
    "Click OK to open Discord and earn points!"
  );
  console.log('User wants to follow:', userWantsToFollow);
  
  if (userWantsToFollow) {
    window.open('https://discord.gg/your-discord-invite', '_blank');

    // Update user as following and give points (pass current points to avoid extra query)
    await updateDiscordFollowStatus(username, currentPoints);
    showPointsBadge(50, "Thanks for following! +50 Points! 🎉");
  } else {
    showPointsBadge(0, "No worries! Follow us anytime for +50 points! 🐦");
  }
};

// Update existing user's follow status
const updateUserFollowStatus = async (username, currentPoints = 0) => {
  try {
    // Update user as following with calculated points (no extra query needed!)
    const { error: updateError } = await supabase
      .from("user_leaderboard")
      .update({
        twitter_following: true,
        total_points: currentPoints + 100  // Use passed currentPoints
      })
      .eq("username", username);

    if (updateError) throw updateError;

    // Add transaction record
    await supabase.from("point_transactions").insert([{
      username: username,
      activity_type: "twitter_follow",
      points_earned: 100,
      description: "Following on Twitter",
    }]);

  } catch (error) {
    console.error('Error updating follow status:', error);
    throw error;
  }
};

const updateDiscordFollowStatus = async (username, currentPoints = 0) => {
  try {
    // Update user as joined server with calculated points (no extra query needed!)
    const { error: updateError } = await supabase
      .from("user_leaderboard")
      .update({
        discord_joined_server: true,
        total_points: currentPoints + 50  // Use passed currentPoints
      })
      .eq("username", username);

    if (updateError) throw updateError;

    // Add transaction record
    await supabase.from("point_transactions").insert([{
      username: username,
      activity_type: "discord_join_server",
      points_earned: 50,
      description: "Joined Discord server",
    }]);

  } catch (error) {
    console.error('Error updating follow status:', error);
    throw error;
  }
};


const handleDailyCheckin = async () => {
  try {
    // Get current user (you'll need to implement this based on your auth system)
    const username = getUsernameFromSession(); // Replace with your actual user retrieval method
    console.log('Handling daily check-in for user:', username);
    
    if (!username ) {
      //implement something else here.
      showPointsBadge(0, `Connect with X or Discord to earn Points!!!`);
      showToast("Connect with X or Discord to earn Points!!!", "error");
      return;
    }

    
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Check if user has already checked in today
    const { data: existingCheckin, error: checkinError } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('username', username)
      .eq('checkin_date', today)
      .single();

    if (checkinError && checkinError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected if no checkin exists
      console.error('Error checking existing checkin:', checkinError);
      showToast("Error checking daily check-in status", "error");
      return;
    }

    // If user already checked in today, show message and return
    if (existingCheckin) {
      showToast("You've already checked in today! Come back tomorrow.", "info");
      showPointsBadge(0, "You've already checked in today! Come back tomorrow.");
      console.log('You have already checked in today! Come back tomorrow.', existingCheckin);
      return;
    }

    // Start transaction-like operations
    const pointsToAdd = 20;

    // 1. Insert daily check-in record
    const { error: insertCheckinError } = await supabase
      .from('daily_checkins')
      .insert({
        username: username,
        checkin_date: today,
        points_earned: pointsToAdd
      });

    if (insertCheckinError) {
      console.error('Error inserting daily checkin:', insertCheckinError);
      showToast("Failed to record daily check-in", "error");
      return;
    }

    // 2. Get current user data from leaderboard
    const { data: currentUserData, error: getUserError } = await supabase
      .from('user_leaderboard')
      .select('*')
      .eq('username', username)
      .single();

    if (getUserError) {
      console.error('Error getting user data:', getUserError);
      showToast("Error updating user points", "error");
      return;
    }

    // 3. Calculate new streak
    const lastCheckinDate = currentUserData?.last_checkin_date;
    let newStreak = 1;
    
    if (lastCheckinDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastCheckinDate === yesterdayStr) {
        // Consecutive day, increment streak
        newStreak = (currentUserData.checkin_streak || 0) + 1;
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
      }
    }

    // 4. Update user leaderboard with new points and streak
    const { error: updateLeaderboardError } = await supabase
      .from('user_leaderboard')
      .update({
        total_points: (currentUserData?.total_points || 0) + pointsToAdd,
        last_checkin_date: today,
        checkin_streak: newStreak,
        updated_at: new Date().toISOString()
      })
      .eq('username', username);

    if (updateLeaderboardError) {
      console.error('Error updating leaderboard:', updateLeaderboardError);
      showToast("Error updating leaderboard", "error");
      return;
    }

    // 5. Insert point transaction record
    const { error: insertTransactionError } = await supabase
      .from('point_transactions')
      .insert({
        username: username,
        activity_type: 'daily_checkin',
        points_earned: pointsToAdd,
        description: `Daily check-in reward. Streak: ${newStreak} days`
      });

    if (insertTransactionError) {
      console.error('Error inserting point transaction:', insertTransactionError);
      // Don't return here as the main functionality worked
    }

    // Success! Show the points badge animation
    showPointsBadge(pointsToAdd, `Daily Check-in Complete! 🔥 ${newStreak} day streak!`);
    
    // Optional: Show success toast
    showToast(`+${pointsToAdd} points earned! ${newStreak} day streak!`, "success");

  } catch (error) {
    console.error('Unexpected error during daily checkin:', error);
    showToast("An unexpected error occurred", "error");
  }
};



  const handlePostSubmit = async (formData) => {
    try {
      // Get current user (you'll need to implement this based on your auth system)
    const username = getUsernameFromSession(); // Replace with your actual user retrieval method
    console.log('Handling post for user', username);
    
    if (!username ) {
      //implement something else here.
      showPointsBadge(0, `Connect with X or Discord to submit posts!!!`);
      showToast("Connect with X or Discord to submit posts!!!", "error");
      return;
    }

      const { data, error } = await supabase
        .from('user_posts_to_feature_or_points')
        .insert([{
          ...formData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setShowPostModal(false);
        // Replace showPointsBadge with celebration popup
    setShowCelebration(true);
      // // Refresh posts
      // fetchCommunityPosts(true);
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Error submitting post. Please try again.');
    }
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

  const GameActionCard = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  buttonVariant = "primary",
  onAction,
  gradientFrom,
  gradientTo,
  borderColor,
  imageUrl,
  reverseLayout = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    try {
      await onAction();
    } finally {
      setTimeout(() => setIsAnimating(false), 3000);
    }
  };

  return (
   <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className={`relative w-full my-8 group ${reverseLayout ? 'pl-8' : 'pr-8'}`} // Removed overflow-hidden
>
  {/* ===== OUTER GLOW EFFECT (NEW) ===== */}
  <div className="absolute -inset-2 rounded-xl overflow-visible pointer-events-none z-0">
    {/* Base Glow Layer */}
    <div className="absolute inset-0 rounded-xl bg-purple-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"></div>
    {/* Edge Highlight */}
    <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>
  </div>

  {/* Existing glowing border */}
  <div className={`absolute top-0 bottom-0 w-1 ${reverseLayout ? 'right-0' : 'left-0'} 
    bg-gradient-to-b from-white via-purple-800 to-white shadow-[0_0_15px_5px_rgba(191,82,222,0.5)] z-10`}
  ></div>
  
  {/* Main card container */}
  <div className={`relative z-20 flex ${reverseLayout ? 'flex-row-reverse' : 'flex-row'} 
    bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden
    border border-gray-700 h-96`}
  >
    {/* Image side */}
    <div className="w-1/2 relative overflow-hidden h-full">
      <motion.div
        className="relative w-full h-full overflow-hidden"
        whileInView={{
          y: [0, -15, 0],
          transition: {
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }
        }}
        viewport={{ once: false }}
      >
        <motion.img
          src={imageUrl}
          alt={title}
          className="relative z-10 w-full h-full object-cover"
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.3 } 
          }}
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 pointer-events-none z-20">
         <div className="[&>img]:w-12 [&>img]:h-12">
    {typeof icon === 'string' ? (
      <span className="text-5xl">{icon}</span>
    ) : (
      icon
    )}
  </div>
      </div>
    </div>
    
    {/* Content side */}
    <div className="w-1/2 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 font-mono tracking-wider">{title}</h3>
        <p className="text-white mb-4">{description}</p>
      </div>
      
      <GameButton 
        onClick={handleClick} 
        variant={buttonVariant}
        className={`w-full pulse-on-hover ${isAnimating ? 'animate-pulse' : ''}`}
        disabled={isAnimating}
      >
        {isAnimating ? '...' : buttonText}
      </GameButton>
    </div>
  </div>
</motion.div>
  );
};

  return (
    <>
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
      />

       {/* ADD THIS: Celebration Popup Component */}
      <CelebrationPopup
        show={showCelebration}
        message="Post submitted for review! Points coming your way!"
        variant="text" // or "bubble" - try both and see which you prefer
        onComplete={() => setShowCelebration(false)} // This closes the popup
      />

      <motion.div 
        className="relative w-fit"
        initial={{ x: 1500, opacity: 0 }} 
        whileInView={{ x: 0, opacity: 1 }} 
        transition={{type:"spring", duration: 0.75 , delay: 0.5 }} 
        viewport={{ once: true }}
      >
        {/* white background box */}
        <div className="skew-x-[-15deg] px-36 py-8 z-0 relative bg-white">
          {/* Placeholder to give it shape */}
          <div className="invisible">Placeholder</div>
        </div>

        {/* purple overlay box */}
        <div className="absolute top-[-10px] left-[-18px] z-10 skew-x-[-15deg] px-20 py-6 shadow-lg" style={{ backgroundColor: '#bf52de' }}>
          <h2 className="text-white text-4xl font-bold skew-x-[-12deg]">COMMUNITY</h2>
        </div>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 3)}
        className="mt-10 text-white text-[15px] max-w-5xl leading-[30px]"
      >
        Break the code together.
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 3)}
        className="mt-4 text-white text-[15px] max-w-5xl leading-[30px]"
      >
        Aura isn't just a project, it's a movement.
        The community isn't the background, it's the engine.
      </motion.p>
      <motion.p
        variants={fadeIn("", "", 0.1, 3)}
        className="mt-4 text-white text-[15px] max-w-5xl leading-[30px]"
      >
        Earn your place, shape the story, and make your Aura seen.
      </motion.p>
      <SignOutButton/>
       <button 
        onClick={testCelebration}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Celebration
      </button>

     <div className="max-w-6xl mx-auto px-4">
  {/* Daily Check-In */}
  <GameActionCard
    icon="🔹"
    title="DAILY CHECK-IN"
    description="Show up daily. Earn progress on the leaderboard. Get closer to whitelist and personalized 3D avatar."
    buttonText="✅ CHECK IN"
    buttonVariant="primary"
    onAction={handleDailyCheckin}
    gradientFrom="from-purple-500"
    gradientTo="to-pink-500"
    imageUrl="/Anime.jpg" // Using your image // Add your image path
  />

  {/* Vote: Hero vs Villain */}
  <GameActionCard
    icon="⚔️"
    title="HERO VS VILLAIN"
    description="Your voice shapes the weekly battle. Weekly battle shapes history."
    buttonText="🗳️ CAST VOTE"
    buttonVariant="danger"
    onAction={() => {}}
    gradientFrom="from-red-500"
    gradientTo="to-amber-500"
    imageUrl="/Anime.jpg" // Using your image
    reverseLayout={true}
  />

  {/* Post Your Aura */}
  <GameActionCard
    icon="✨"
    title="POST YOUR AURA"
    description="Tell your story. Get featured. Earn rewards for quality content."
    buttonText="📝 SUBMIT POST"
    buttonVariant="success"
    onAction={() => setShowPostModal(true)}
    gradientFrom="from-green-500"
    gradientTo="to-emerald-500"
    imageUrl="/Anime.jpg" // Using your image
  />

  {/* Join Discord */}
  <GameActionCard
    icon={
    <img 
      src="/discordIcon.svg" 
      alt="Discord" 
      className="w-12 h-12 object-contain"
    />
  }
    title="JOIN DISCORD"
    description="Talk, share, learn and get early updates and opportunities."
    buttonText="🔗 JOIN NOW"
    buttonVariant="secondary"
    onAction={handleDiscordConnect}
    gradientFrom="from-blue-500"
    gradientTo="to-cyan-500"
    imageUrl="/Anime.jpg" // Using your image
    reverseLayout={true}
  />

{/* Follow on Twitter */}
  <GameActionCard
    icon="𝕏"
    title="Follow on Twitter"
    description="Stay in the loop, vote in battles, share the energy."
    buttonText="🔗 Follow on Twitter"
    buttonVariant="secondary"
    onAction={handleTwitterConnect}
    gradientFrom="from-blue-500"
    gradientTo="to-cyan-500"
    imageUrl="/Anime.jpg" // Using your image
    
  />

</div>

      {/* Featured from the Community */}
      <motion.div
        variants={fadeIn("up", "spring", 0.6, 0.75)}
        className="mt-20"
      >
        <h2 className="text-white text-3xl font-bold mb-4 text-center">
          FEATURED FROM THE COMMUNITY
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Real people. Real auras. Real stories.
        </p>
        
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
        
        <div className="flex justify-center gap-4 mt-8">
          <GameButton 
            onClick={() => fetchCommunityPosts(true)}
            variant="secondary"
          >
            🔄 See More Posts
          </GameButton>
          <GameButton 
            onClick={() => setShowPostModal(true)}
            variant="success"
          >
            ✨ Submit Yours
          </GameButton>
        </div>
      </motion.div>
    </>
  );
};

export default SectionWrapper(CommunityV2, "communityv2");