import React, { useState, useEffect } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";
import supabase from "../utils/supabase";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

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

const Community = () => {
  const [showBadge, setShowBadge] = useState(false);
  const [badgeData, setBadgeData] = useState({ points: 0, message: '' });
  const [showPostModal, setShowPostModal] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const showPointsBadge = (points, message) => {
    setBadgeData({ points, message });
    setShowBadge(true);
  };

  const handleDailyCheckin = async () => {
    // Here you would implement the daily check-in logic
    // For now, just show the animation
    showPointsBadge(20, "Daily Check-in Complete!");
    
    // TODO: Implement actual check-in logic with Supabase
    // - Check if user already checked in today
    // - Add points to user's account
    // - Update check-in streak
  };

  const handleDiscordConnect = () => {
    // Open Discord invite in new tab
    window.open('https://discord.gg/your-discord-invite', '_blank');
    showPointsBadge(50, "Discord Connected!");
    
    // TODO: Implement Discord OAuth integration
  };

  const handleTwitterConnect = () => {
    // Open Twitter follow page in new tab
    window.open('https://twitter.com/your-twitter-handle', '_blank');
    showPointsBadge(100, "Twitter Connected!");
    
    // TODO: Implement Twitter OAuth integration
  };

  const handlePostSubmit = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...formData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setShowPostModal(false);
      showPointsBadge(50, "Post Submitted!");
      
      // Refresh posts
      fetchCommunityPosts(true);
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

  return (
    <>
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
        className="mt-4 text-white text-[15px] max-w-5xl leading-[30px]"
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

      {/* Community Actions */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Daily Check-In */}
        <motion.div 
          variants={fadeIn("up", "spring", 0.1, 0.75)}
          className="bg-gradient-to-br from-gray-900 to-purple-900 p-6 rounded-2xl border-2 border-purple-500 skew-x-[-5deg] transform hover:skew-x-[-2deg] transition-transform duration-300"
        >
          <div className="skew-x-[5deg]">
            <div className="text-4xl mb-4">🔹</div>
            <h3 className="text-white text-xl font-bold mb-3">Daily Check-In</h3>
            <p className="text-gray-300 text-sm mb-4">
              Show up daily. Earn progress on the leaderboard. Get closer to whitelist and personalized 3D avatar.
            </p>
            <GameButton onClick={handleDailyCheckin} className="w-full">
              ✅ Check In
            </GameButton>
          </div>
        </motion.div>

        {/* Vote: Hero vs Villain */}
        <motion.div 
          variants={fadeIn("up", "spring", 0.2, 0.75)}
          className="bg-gradient-to-br from-gray-900 to-red-900 p-6 rounded-2xl border-2 border-red-500 skew-x-[-5deg] transform hover:skew-x-[-2deg] transition-transform duration-300"
        >
          <div className="skew-x-[5deg]">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-white text-xl font-bold mb-3">Vote: Hero vs Villain</h3>
            <p className="text-gray-300 text-sm mb-4">
              Your voice shapes the weekly battle. Weekly battle shapes history.
            </p>
            <GameButton variant="danger" className="w-full">
              🗳️ Cast Your Vote
            </GameButton>
          </div>
        </motion.div>

        {/* Post Your Aura */}
        <motion.div 
          variants={fadeIn("up", "spring", 0.3, 0.75)}
          className="bg-gradient-to-br from-gray-900 to-green-900 p-6 rounded-2xl border-2 border-green-500 skew-x-[-5deg] transform hover:skew-x-[-2deg] transition-transform duration-300"
        >
          <div className="skew-x-[5deg]">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-white text-xl font-bold mb-3">Post Your Aura</h3>
            <p className="text-gray-300 text-sm mb-4">
              Tell your story. Get featured.
            </p>
            <GameButton 
              variant="success" 
              onClick={() => setShowPostModal(true)}
              className="w-full"
            >
              📝 Submit Your Post
            </GameButton>
          </div>
        </motion.div>

        {/* Join Discord */}
        <motion.div 
          variants={fadeIn("up", "spring", 0.4, 0.75)}
          className="bg-gradient-to-br from-gray-900 to-blue-900 p-6 rounded-2xl border-2 border-blue-500 skew-x-[-5deg] transform hover:skew-x-[-2deg] transition-transform duration-300"
        >
          <div className="skew-x-[5deg]">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-white text-xl font-bold mb-3">Join Discord</h3>
            <p className="text-gray-300 text-sm mb-4">
              Talk, share, learn and get early updates and opportunities.
            </p>
            <GameButton 
              variant="secondary" 
              onClick={handleDiscordConnect}
              className="w-full"
            >
              🔗 Join Discord
            </GameButton>
          </div>
        </motion.div>

      </div>

      {/* Follow on Twitter */}
      <motion.div 
        variants={fadeIn("up", "spring", 0.5, 0.75)}
        className="mt-8 bg-gradient-to-br from-gray-900 to-cyan-900 p-6 rounded-2xl border-2 border-cyan-500 max-w-md mx-auto skew-x-[-5deg] transform hover:skew-x-[-2deg] transition-transform duration-300"
      >
        <div className="skew-x-[5deg]">
          <div className="text-4xl mb-4 text-center">🐦</div>
          <h3 className="text-white text-xl font-bold mb-3 text-center">Follow on Twitter</h3>
          <p className="text-gray-300 text-sm mb-4 text-center">
            Stay in the loop, vote in battles, share the energy.
          </p>
          <GameButton 
            variant="secondary" 
            onClick={handleTwitterConnect}
            className="w-full"
          >
            🔗 Follow on Twitter
          </GameButton>
        </div>
      </motion.div>

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

export default SectionWrapper(Community, "community");