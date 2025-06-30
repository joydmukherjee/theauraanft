import React, { useState, useEffect } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";
import supabase from "../utils/supabase";

import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

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

const CommunityV1 = () => {
  const { data: session, status } = useSession();
   console.log('Session Status:', status)
  console.log('Session Data:', session)
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

// Add this useEffect to handle Twitter OAuth callback
useEffect(() => {
  console.log("Twitter callback handler triggered");
  console.log("Session status:", status);
  console.log("Session data:", session);

  const handleTwitterCallback = async () => {
    if (status === "loading") {
      console.log("Session still loading...");
      return;
    }

    if (!session?.twitter_username && !session?.user?.name) {
      console.log("No Twitter session found");
      return;
    }

    try {
      console.log("Checking Twitter follow status...");
      
      // Prepare session data to send to API
      const sessionData = {
        twitter_id: session.twitter_id,
        twitter_username: session.twitter_username,
        accessToken: session.accessToken
      };
      
      console.log("Sending session data to API:", {
        ...sessionData,
        accessToken: sessionData.accessToken ? 'present' : 'missing'
      });
      
      // Check if user follows your Twitter account
      const followResponse = await fetch('/api/check-twitter-follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData) // Send session data in request body
      });

      console.log("Follow response status:", followResponse.status);

      if (!followResponse.ok) {
        const errorData = await followResponse.json();
        console.error("Follow check failed:", errorData);
        
        // Still sync the user even if follow check fails
        const username = session.twitter_username || session.user?.name;
        if (username) {
          await syncTwitterUser(username, false);
          showPointsBadge(50, "Twitter Connected! Follow us for more points!");
        }
        return;
      }

      const followData = await followResponse.json();
      console.log("Follow data:", followData);
      
      const username = followData.twitter_username || session.twitter_username || session.user?.name;
      
      if (followData.isFollowing) {
        // User is following, sync to database
        await syncTwitterUser(username, true);
      } else {
        // User signed in but not following yet
        await syncTwitterUser(username, false);
        // Show message about following
        showPointsBadge(50, "Twitter Connected! Follow us for +100 more points!");
      }
    } catch (error) {
      console.error('Error handling Twitter callback:', error);
      
      // Fallback: still sync user even if there's an error
      const username = session.twitter_username || session.user?.name;
      if (username) {
        await syncTwitterUser(username, false);
        showPointsBadge(50, "Twitter Connected!");
      }
    }
  };

  // Only run when session changes and is not loading
  if (status !== "loading") {
    handleTwitterCallback();
  }
}, [session, status]);


// Update your syncTwitterUser function
const syncTwitterUser = async (twitterUsername, isFollowing = false) => {
  try {
    console.log("Syncing Twitter user:", twitterUsername, "Following:", isFollowing);
    
    // Check if user exists in leaderboard
    const { data: existing, error: fetchError } = await supabase
      .from("user_leaderboard")
      .select("*")
      .eq("username", twitterUsername)
      .single();

    let pointsToAdd = 0;
    let message = "";

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create new entry
      const initialPoints = isFollowing ? 150 : 50; // Connection bonus + follow bonus
      
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

      if (isFollowing) {
        pointsToAdd = 150;
        message = "Twitter Connected & Following! +150 Points!";
        
        // Add transaction records
        await supabase.from("point_transactions").insert([
          {
            username: twitterUsername,
            activity_type: "twitter_connect",
            points_earned: 50,
            description: "Connected Twitter account",
          },
          {
            username: twitterUsername,
            activity_type: "twitter_follow",
            points_earned: 100,
            description: "Following on Twitter",
          }
        ]);
      } else {
        pointsToAdd = 50;
        message = "Twitter Connected! +50 Points! Follow us for +100 more!";
        
        await supabase.from("point_transactions").insert([{
          username: twitterUsername,
          activity_type: "twitter_connect",
          points_earned: 50,
          description: "Connected Twitter account",
        }]);
      }

    } else if (!fetchError) {
      // User exists, update if needed
      const updates = {};
      let newPoints = existing.total_points || 0;
      
      if (!existing.twitter_connected) {
        updates.twitter_connected = true;
        pointsToAdd += 50; // Connection bonus
        newPoints += 50;
        
        await supabase.from("point_transactions").insert([{
          username: twitterUsername,
          activity_type: "twitter_connect",
          points_earned: 50,
          description: "Connected Twitter account",
        }]);
      }

      if (isFollowing && !existing.twitter_following) {
        updates.twitter_following = true;
        pointsToAdd += 100;
        newPoints += 100;
        message = pointsToAdd > 100 ? 
          "Twitter Connected & Following! +" + pointsToAdd + " Points!" : 
          "Thanks for following! +100 points earned!";
        
        // Add transaction record
        await supabase.from("point_transactions").insert([{
          username: twitterUsername,
          activity_type: "twitter_follow",
          points_earned: 100,
          description: "Following on Twitter",
        }]);
      } else if (!isFollowing && existing.twitter_connected && pointsToAdd === 0) {
        message = "Welcome back! Follow us on Twitter for +100 points!";
      }

      if (Object.keys(updates).length > 0) {
        updates.total_points = newPoints;
        
        const { error: updateError } = await supabase
          .from("user_leaderboard")
          .update(updates)
          .eq("username", twitterUsername);

        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
      }
    } else {
      console.error("Fetch error:", fetchError);
      throw fetchError;
    }

    if (pointsToAdd > 0 || message) {
      showPointsBadge(pointsToAdd, message || `Welcome back, ${twitterUsername}!`);
    }

  } catch (error) {
    console.error('Error syncing Twitter user:', error);
    // Show error message to user
    showPointsBadge(0, "Connection successful, but couldn't update points. Please refresh!");
  }
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

//   const handleTwitterConnect = async () => {
//     showPointsBadge(100, "Twitter Connected!");
//     // TODO: Implement Twitter OAuth integration
//   await signIn("twitter", { callbackUrl: "/communityv1" });
// };

  
// Update your handleTwitterConnect function
const handleTwitterConnect = async () => {
  if (session?.twitter_username || session?.user?.name) {
    // User is already connected, check follow status
    try {
      const sessionData = {
        twitter_id: session.twitter_id,
        twitter_username: session.twitter_username,
        accessToken: session.accessToken
      };
      
      const response = await fetch('/api/check-twitter-follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Follow status:', data);
        
        if (data.isFollowing) {
          showPointsBadge(0, "Already following! Thanks for your support! 🎉");
        } else {
          window.open('https://twitter.com/AURAinWEB3', '_blank');
          showPointsBadge(0, "Please follow us and refresh the page for +100 points!");
        }
      } else {
        const errorData = await response.json();
        console.error('Follow check error:', errorData);
        // If check fails, just open Twitter
        window.open('https://twitter.com/AURAinWEB3', '_blank');
        showPointsBadge(0, "Please follow us and refresh the page!");
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
      window.open('https://twitter.com/AURAinWEB3', '_blank');
    }
  } else {
    // Start OAuth flow
    try {
      await signIn("twitter", { callbackUrl: window.location.origin + "/#communityv1" });
    } catch (error) {
      console.error('Error starting Twitter OAuth:', error);
      showPointsBadge(0, "Error connecting to Twitter. Please try again!");
    }
  }
};

  const handlePostSubmit = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('user_posts_to_feature_or_points')
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

export default SectionWrapper(CommunityV1, "communityv1");