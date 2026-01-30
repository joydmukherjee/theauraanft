// components/Studio.jsx
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";
import StudioModal from "./StudioModal";
import { useSession } from "next-auth/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Studio = () => {
  const [openModal, setOpenModal] = useState(null);
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const { data: session } = useSession();
  
  // Refs for GSAP animations
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const contentSectionsRef = useRef([]);
  const buttonsRef = useRef([]);
  const speechBubbleRef = useRef(null);
  const dotsRef = useRef([]);

  const hasValidSession = () => {
    return session && (
      session.twitter_username ||
      session.discord_username ||
      session.user?.name
    );
  };

  const getUsernameFromSession = () => {
    if (session?.twitter_username) return session.twitter_username;
    if (session?.discord_username) return session.discord_username;
    if (session?.user?.name) return session.user.name;
    return 'Anonymous User';
  };

  const getUserImageFromSession = () => {
    return session?.user?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';
  };

  const handleModalOpen = (type) => {
    // GSAP animation for button press
    gsap.to(event.target, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });

    if (!hasValidSession()) {
      setShowConnectPrompt(true);
      setTimeout(() => setShowConnectPrompt(false), 3000);
      return;
    }
    setOpenModal(type);
  };

  const handleModalClose = () => setOpenModal(null);

  useEffect(() => {
  const ctx = gsap.context(() => {
    // Initial setup - hide elements
    gsap.set([leftPanelRef.current, rightPanelRef.current], { 
      opacity: 0, 
      y: 100, 
      rotation: 5 
    });
    gsap.set(titleRef.current, { 
      scale: 0, 
      rotation: -10, 
      transformOrigin: "center center" 
    });
    gsap.set(subtitleRef.current, { 
      x: -200, 
      opacity: 0, 
      rotation: 5 
    });
    gsap.set(contentSectionsRef.current, { 
      x: -100, 
      opacity: 0, 
      stagger: 0.1 
    });
    gsap.set(buttonsRef.current, { 
      y: 50, 
      opacity: 0, 
      scale: 0.8 
    });
    gsap.set(speechBubbleRef.current, { 
      scale: 0, 
      rotation: 10, 
      transformOrigin: "bottom left" 
    });

    // ⚡ INSTANT TEXT APPEARANCE - NO STAGGERED ANIMATIONS
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Everything appears at once - no delays or staggers
    tl.to([
      leftPanelRef.current, 
      rightPanelRef.current,
      titleRef.current,
      subtitleRef.current,
      ...contentSectionsRef.current,
      ...buttonsRef.current,
      speechBubbleRef.current
    ], {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotation: 0,
      duration: 0.4, // Single fast animation
      ease: "power2.out"
    });

    // 🐌 MUCH SLOWER CONTINUOUS ANIMATIONS
    // Floating animation for panels - MUCH SLOWER
    gsap.to(leftPanelRef.current, {
      y: -10, // Keep same movement amount
      rotation: 1, // Keep same rotation
      duration: 18, // 🐌 MUCH SLOWER (was 3)
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(rightPanelRef.current, {
      y: 10, // Keep same movement amount
      rotation: -1, // Keep same rotation
      duration: 9, // 🐌 MUCH SLOWER (was 3.5)
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2 // Slightly longer delay
    });

    // Title text color animation - MUCH SLOWER
    gsap.to(titleRef.current, {
      color: "#fbbf24", // yellow-400
      duration: 6, // 🐌 MUCH SLOWER (was 2)
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 3 // Longer delay
    });

    // Speech bubble wiggle - KEEP ORIGINAL SPEED
    gsap.to(speechBubbleRef.current, {
      rotation: 2, // Keep same rotation amount
      duration: 1.5, // ✅ KEEP ORIGINAL (as requested)
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 5 // Longer delay
    });

    // Dots animation for each content section - KEEP ORIGINAL SPEED
    contentSectionsRef.current.forEach((section, index) => {
      if (section) {
        const dots = section.querySelectorAll('.comic-dot');
        gsap.to(dots, {
          opacity: 0.8,
          scale: 1.2,
          duration: 0.5, // ✅ KEEP ORIGINAL (as requested)
          ease: "power2.inOut",
          stagger: 0.1, // ✅ KEEP ORIGINAL (as requested)
          yoyo: true,
          repeat: -1,
          delay: index * 0.5 // ✅ KEEP ORIGINAL (as requested)
        });
      }
    });

    // Button hover animations - keep responsive
    buttonsRef.current.forEach((button) => {
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

    // Typing effect for speech bubble - keep the typing effect
    const speechText = speechBubbleRef.current?.querySelector('.speech-text');
    if (speechText) {
      gsap.to(speechText, {
        text: "CREATE. COLLABORATE. CONQUER.",
        duration: 2, // Keep original typing duration
        ease: "none",
        delay: 4 // Keep original delay
      });
    }

  }, containerRef);

  return () => ctx.revert();
}, []);

return (
  <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 lg:p-8">
    {/* Comic Book Style Container */}
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
        
        {/* Left Panel - Text Content */}
        <div ref={leftPanelRef} className="relative w-full">
          {/* Comic Panel Border */}
          <div className="relative bg-white p-4 lg:p-8 rounded-2xl border-4 lg:border-8 border-black shadow-2xl w-full">
            
            {/* Inner Panel */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 lg:p-8 rounded-xl border-2 lg:border-4 border-black relative overflow-hidden w-full">
              
              {/* Animated Comic Book Dots Pattern */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(50)].map((_, i) => (
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
              
              {/* Content */}
              <div className="relative z-10 w-full">
                {/* Title */}
                <div className="relative mb-6 lg:mb-8">
                  <h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center font-comic tracking-wider">
                    AURA 3D
                  </h2>
                  <div ref={subtitleRef} className="bg-yellow-400 text-black text-xl md:text-2xl lg:text-3xl font-black px-3 lg:px-4 py-2 rounded-lg mt-2 text-center border-2 lg:border-4 border-black">
                    STUDIO
                  </div>
                </div>

                {/* Content List */}
                <div className="space-y-4 lg:space-y-6 text-white">
                  <div 
                    ref={el => contentSectionsRef.current[0] = el}
                    className="bg-black bg-opacity-50 p-3 lg:p-4 rounded-lg border-2 border-yellow-400 relative overflow-hidden"
                  >
                    <div className="comic-dots absolute inset-0 opacity-10"></div>
                    <h3 className="text-yellow-400 font-bold text-lg lg:text-xl mb-2 font-comic relative z-10">WHAT'S HAPPENING NOW:</h3>
                    <p className="text-sm lg:text-lg font-medium relative z-10">NFT collection art is being finalized and prepared for minting. MVP of our FUN-TO-PLAY game is underway, alongwith an amazing trailer.</p>
                  </div>

                  <div 
                    ref={el => contentSectionsRef.current[1] = el}
                    className="bg-black bg-opacity-50 p-3 lg:p-4 rounded-lg border-2 border-pink-400 relative overflow-hidden"
                  >
                    <div className="comic-dots absolute inset-0 opacity-10"></div>
                    <h3 className="text-pink-400 font-bold text-lg lg:text-xl mb-2 font-comic relative z-10">PROMO CONTENT:</h3>
                    <p className="text-sm lg:text-lg font-medium relative z-10">Stylized trailers, character reveals, and immersive visuals in the works.</p>
                  </div>

                  

                  <div 
                    ref={el => contentSectionsRef.current[3] = el}
                    className="bg-black bg-opacity-50 p-3 lg:p-4 rounded-lg border-2 border-green-400 relative overflow-hidden"
                  >
                    <div className="comic-dots absolute inset-0 opacity-10"></div>
                    <h3 className="text-green-400 font-bold text-lg lg:text-xl mb-2 font-comic relative z-10">CUSTOM COMMISSIONS:</h3>
                    <p className="text-sm lg:text-lg font-medium relative z-10">Every request fuels the Studio and we are open for commissions.</p>
                  </div>

                  <div 
                    ref={el => contentSectionsRef.current[4] = el}
                    className="bg-black bg-opacity-50 p-3 lg:p-4 rounded-lg border-2 border-orange-400 relative overflow-hidden"
                  >
                    <div className="comic-dots absolute inset-0 opacity-10"></div>
                    <h3 className="text-orange-400 font-bold text-lg lg:text-xl mb-2 font-comic relative z-10">COLLABORATIONS:</h3>
                    <p className="text-sm lg:text-lg font-medium relative z-10">From visuals to lore-based designs, Aura Studio crafts immersive stories. We are open for collaborations.</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 lg:gap-4 mt-6 lg:mt-8">
                  <button 
                    ref={el => buttonsRef.current[0] = el}
                    onClick={() => handleModalOpen("collab")} 
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-4 lg:px-6 py-2 lg:py-3 rounded-lg border-2 lg:border-4 border-black shadow-lg font-comic text-base lg:text-lg"
                  >
                    🤝 COLLABORATE
                  </button>
                  <button 
                    ref={el => buttonsRef.current[1] = el}
                    onClick={() => handleModalOpen("commission")} 
                    className="bg-pink-500 hover:bg-pink-400 text-white font-bold px-4 lg:px-6 py-2 lg:py-3 rounded-lg border-2 lg:border-4 border-black shadow-lg font-comic text-base lg:text-lg"
                  >
                    🎨 COMMISSION
                  </button>
                  {/* <button 
                    ref={el => buttonsRef.current[2] = el}
                    onClick={() => handleModalOpen("learn")} 
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-4 lg:px-6 py-2 lg:py-3 rounded-lg border-2 lg:border-4 border-black shadow-lg font-comic text-base lg:text-lg"
                  >
                    🎓 LEARN
                  </button> */}
                </div>

                {/* Connect Prompt */}
                {showConnectPrompt && (
                  <motion.div
                    className="mt-4 lg:mt-6 bg-red-500 text-white p-3 lg:p-4 rounded-lg border-2 lg:border-4 border-black font-comic text-base lg:text-lg font-bold text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    ⚠️ CONNECT TWITTER OR DISCORD TO GET STARTED!
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div ref={rightPanelRef} className="relative w-full">
          {/* Comic Panel Border */}
          <div className="relative bg-white p-4 lg:p-8 rounded-2xl border-4 lg:border-8 border-black shadow-2xl h-80 md:h-96 lg:h-full">
            
            {/* Inner Panel */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 lg:p-4 rounded-xl border-2 lg:border-4 border-black h-full flex items-center justify-center relative overflow-hidden">
              
              {/* Animated Comic Book Dots Pattern */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(30)].map((_, i) => (
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
              
              {/* Image Container */}
              <div className="relative z-10 w-full h-full">
                <img 
                  src="/vaura.png" 
                  alt="Aura Studio Comic" 
                  className="w-full h-full object-cover rounded-lg border-2 lg:border-4 border-black shadow-xl" 
                />
                
                {/* Animated Comic Speech Bubble - Responsive positioning */}
                <div 
                  ref={speechBubbleRef}
                  className="absolute top-2 right-2 lg:top-4 lg:right-4 bg-white text-black p-2 lg:p-3 rounded-xl lg:rounded-2xl border-2 lg:border-4 border-black font-comic font-bold text-xs lg:text-sm max-w-24 md:max-w-32 lg:max-w-xs"
                >
                  <div className="relative">
                    <span className="speech-text block leading-tight"></span>
                    <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-0 h-0 border-l-4 lg:border-l-8 border-l-white border-t-4 lg:border-t-8 border-t-transparent border-b-4 lg:border-b-8 border-b-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal */}
    {openModal && (
      <StudioModal
        type={openModal}
        onClose={handleModalClose}
        username={getUsernameFromSession()}
        avatarUrl={getUserImageFromSession()}
      />
    )}

    {/* Enhanced CSS with animations */}
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

      /* Mobile optimizations */
      @media (max-width: 1024px) {
        .grid {
          gap: 1.5rem;
        }
      }
      
      @media (max-width: 768px) {
        .grid {
          gap: 1rem;
        }
      }
    `}</style>
  </div>
);
};

export default SectionWrapper(Studio, "studio");