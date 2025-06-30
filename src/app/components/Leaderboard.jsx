import React, { useState, useEffect, useRef } from 'react';
import { FaTrophy, FaMedal, FaFire, FaChevronDown, FaDiscord, FaTwitter, FaCrown, FaStar } from 'react-icons/fa';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Refs for GSAP animations
  const titleRef = useRef(null);
  const heroRef = useRef(null);
  const fireRefs = useRef([]);
  const gradientRef = useRef(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (!loading && typeof window !== 'undefined' && window.gsap) {
      initGSAPAnimations();
    } else if (!loading) {
      // Load GSAP if not available
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      script.onload = () => {
        initGSAPAnimations();
      };
      document.head.appendChild(script);
    }
  }, [loading]);

  const initGSAPAnimations = () => {
    const gsap = window.gsap;
    
    // Title animation - starts small and grows with parallax effect
    gsap.fromTo(titleRef.current, 
      { 
        scale: 0.3, 
        opacity: 0, 
        y: 100,
        rotationX: -90,
        transformOrigin: "center center"
      },
      { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        rotationX: 0,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
      }
    );

    // Parallax background gradient animation
    gsap.to(gradientRef.current, {
      backgroundPosition: "200% 50%",
      duration: 10,
      ease: "none",
      repeat: -1,
      yoyo: true
    });

    // Fire icons pulsing animation
    fireRefs.current.forEach((fire, index) => {
      if (fire) {
        gsap.to(fire, {
          scale: 1.2,
          rotation: 15,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.3
        });
      }
    });

    // Hero section parallax on scroll
    gsap.to(heroRef.current, {
      y: -50,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

    // Stagger animation for leaderboard rows
    gsap.fromTo(".leaderboard-row", 
      { 
        opacity: 0, 
        x: -100,
        scale: 0.8
      },
      { 
        opacity: 1, 
        x: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.1,
        delay: 1
      }
    );
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard?page=1&limit=20');
      const data = await response.json();
      
      if (data.success) {
        setLeaderboardData(data.data);
        setHasMore(data.hasMore);
      } else {
        console.error('Failed to fetch leaderboard:', data.error);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetch(`/api/leaderboard?page=${nextPage}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboardData(prev => [...prev, ...data.data]);
        setPage(nextPage);
        setHasMore(data.hasMore);
      } else {
        console.error('Failed to fetch more leaderboard data:', data.error);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-yellow-400 text-2xl animate-bounce" />;
    if (rank === 2) return <FaTrophy className="text-gray-400 text-xl animate-pulse" />;
    if (rank === 3) return <FaMedal className="text-amber-600 text-xl animate-pulse" />;
    return null;
  };

  const getRankStyle = (rank) => {
    if (rank <= 3) return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-black text-2xl shadow-lg shadow-yellow-500/50";
    if (rank <= 10) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl shadow-lg shadow-purple-500/50";
    return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg shadow-lg shadow-blue-500/30";
  };

  const getRowStyle = (rank) => {
    if (rank <= 3) return "bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border-yellow-400/30 shadow-yellow-400/20";
    if (rank <= 10) return "bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-400/30 shadow-purple-400/20";
    return "bg-gradient-to-r from-gray-800/40 to-gray-700/40 border-gray-600/30 shadow-gray-400/10";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Leaderboard</h2>
          <p className="text-purple-300">Fetching the champions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20 overflow-hidden">
      {/* Hero Section with GSAP Animations */}
      <div className="relative overflow-hidden mb-12" ref={heroRef}>
        <div 
          ref={gradientRef}
          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 transform -skew-y-1"
          style={{ backgroundSize: '200% 100%' }}
        ></div>
        
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-4 transform -skew-x-6 drop-shadow-2xl"
            style={{ perspective: '1000px' }}
          >
            LEADERBOARD
          </h1>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            <FaFire 
              ref={el => fireRefs.current[0] = el}
              className="text-orange-500 text-3xl" 
            />
            <p className="text-xl text-white font-semibold">Battle for the Crown</p>
            <FaFire 
              ref={el => fireRefs.current[1] = el}
              className="text-orange-500 text-3xl" 
            />
          </div>
          
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Leaderboard Container */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="grid grid-cols-12 gap-4 text-white font-bold text-sm md:text-base">
              <div className="col-span-2 text-center">RANK</div>
              <div className="col-span-6 md:col-span-4">CHAMPION</div>
              <div className="col-span-2 md:col-span-4 text-center">BADGES</div>
              <div className="col-span-2 text-right">AURA</div>
            </div>
          </div>

          {/* Leaderboard Rows */}
          <div className="divide-y divide-gray-700/50">
            {leaderboardData.map((user, index) => {
              const rank = index + 1;
              return (
                <div
                  key={user.id}
                  className={`leaderboard-row ${getRowStyle(rank)} border-l-4 hover:bg-gradient-to-r hover:from-purple-800/30 hover:to-pink-800/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl`}
                >
                  <div className="grid grid-cols-12 gap-4 p-4 md:p-6 items-center">
                    
                    {/* Rank */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="relative">
                        <div className={`${getRankStyle(rank)} px-3 py-2 rounded-xl transform -skew-x-12 min-w-[60px] text-center transition-all duration-300 hover:scale-110`}>
                          <span className="transform skew-x-12 inline-block">
                            #{rank}
                          </span>
                        </div>
                        {getRankIcon(rank) && (
                          <div className="absolute -top-2 -right-2">
                            {getRankIcon(rank)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="col-span-6 md:col-span-4 flex items-center space-x-3 md:space-x-4">
                      <div className="relative">
                        <img
                          src={user.avatar_url || "https://via.placeholder.com/80x80/6366f1/ffffff?text=U"}
                          alt={user.username}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-3 border-purple-400 shadow-lg transform hover:scale-110 transition-transform duration-200"
                        />
                        {user.checkin_streak > 10 && (
                          <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                            <FaFire />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg md:text-xl hover:text-purple-300 transition-colors">
                          {user.username}
                        </h3>
                        {user.checkin_streak > 0 && (
                          <p className="text-orange-400 text-sm font-semibold">
                            🔥 {user.checkin_streak} day streak
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="col-span-2 md:col-span-4 flex justify-center space-x-2 flex-wrap gap-2">
                      {/* Aura Brigade Badge - Present for all leaderboard members */}
                      <div className="relative group">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-purple-300 shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center">
                          <FaStar className="text-white text-sm" />
                        </div>
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Aura Brigade
                        </div>
                      </div>

                      {user.twitter_connected && (
                        <div className="relative group">
                          <img
                            src="/Xbadge.jpg"
                            alt="Twitter Connected"
                            className="w-8 h-8 rounded-full border-2 border-blue-400 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                          />
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            X Connected
                          </div>
                        </div>
                      )}
                      
                      {user.discord_connected && (
                        <div className="relative group">
                          <img
                            src="/discordbadge.png" // Discord badge image URL
                            alt="Discord Connected"
                            className="w-8 h-8 rounded-full border-2 border-indigo-400 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                          />
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Discord Connected
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Auras */}
                    <div className="col-span-2 text-right">
                      <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        {user.total_points.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm font-semibold">
                        aura
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="p-8 text-center bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Loading More Champions...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Champions</span>
                    <FaChevronDown className="animate-bounce" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl border border-yellow-500/30 p-6 text-center transform hover:scale-105 transition-transform duration-200">
            <FaTrophy className="text-yellow-400 text-3xl mx-auto mb-2 animate-pulse" />
            <h3 className="text-white font-bold text-xl">Total Champions</h3>
            <p className="text-yellow-400 text-2xl font-black">{leaderboardData.length}</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-xl border border-purple-500/30 p-6 text-center transform hover:scale-105 transition-transform duration-200">
            <FaFire className="text-purple-400 text-3xl mx-auto mb-2 animate-pulse" />
            <h3 className="text-white font-bold text-xl">Active Streaks</h3>
            <p className="text-purple-400 text-2xl font-black">
              {leaderboardData.filter(user => user.checkin_streak > 0).length}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-lg rounded-xl border border-blue-500/30 p-6 text-center transform hover:scale-105 transition-transform duration-200">
            <div className="flex justify-center space-x-2 mb-2">
              <FaTwitter className="text-blue-400 text-xl animate-pulse" />
              <FaDiscord className="text-indigo-400 text-xl animate-pulse" />
            </div>
            <h3 className="text-white font-bold text-xl">Connected Users</h3>
            <p className="text-blue-400 text-2xl font-black">
              {leaderboardData.filter(user => user.discord_connected || user.twitter_connected).length}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-xl border border-purple-500/30 p-6 text-center transform hover:scale-105 transition-transform duration-200">
            <FaStar className="text-purple-400 text-3xl mx-auto mb-2 animate-pulse" />
            <h3 className="text-white font-bold text-xl">Aura Brigade</h3>
            <p className="text-purple-400 text-2xl font-black">{leaderboardData.length}</p>
          </div>
        </div>
      </div>

      {/* GSAP Script Loading */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    </div>
  );
};

export default Leaderboard;