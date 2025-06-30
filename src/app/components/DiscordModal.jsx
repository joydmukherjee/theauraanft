import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

const DiscordModal = ({ 
  type, 
  onClose, 
  username, 
  avatarUrl, 
  onConfirm, 
  onCancel 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Refs for GSAP animations
  const modalRef = useRef(null);
  const titleRef = useRef(null);
  const avatarRef = useRef(null);
  const greetingRef = useRef(null);
  const messageRef = useRef(null);
  const buttonsRef = useRef([]);
  const backgroundDotsRef = useRef([]);
  const speechBubbleRef = useRef(null);
  const pointsBadgeRef = useRef(null);

  const getModalConfig = () => {
    const configs = {
      firstTime: {
        title: "JOIN OUR DISCORD!",
        emoji: "🎮",
        color: "from-indigo-500 to-purple-600",
        borderColor: "border-indigo-400",
        greeting: `Want to earn +50 more points? 🎮`,
        message: "Join our Discord server for:\n• Exclusive updates and announcements\n• Chat with the community\n• Early access to features\n• +50 bonus points! 💎\n\nClick JOIN to open Discord and join our server!",
        icon: "🚀",
        confirmText: "🎮 JOIN DISCORD",
        cancelText: "❌ SKIP",
        points: 50
      },
      existingUser: {
        title: "EARN MORE POINTS!",
        emoji: "👋",
        color: "from-indigo-500 to-blue-600",
        borderColor: "border-indigo-400",
        greeting: `Hi ${username}! 👋`,
        message: "Want to earn +50 more points?\nJust join our Discord server!\n\nClick JOIN to open Discord and earn points!",
        icon: "💰",
        confirmText: "🎮 JOIN DISCORD",
        cancelText: "❌ MAYBE LATER",
        points: 50
      }
    };
    return configs[type] || configs.firstTime;
  };

  const config = getModalConfig();

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  // Prevent event propagation on modal content
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleConfirm = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Button loading animation
    gsap.to(buttonsRef.current[1], {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    try {
      // Open Discord in new tab
      window.open('https://discord.gg/sDh4kwcY', '_blank');
      
      // Call the provided confirm handler
      if (onConfirm) {
        await onConfirm();
      }

      // Show success animation
      setShowSuccess(true);
      
      // Success animation
      gsap.timeline()
        .to(modalRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: "back.out(1.7)"
        })
        .to(modalRef.current, {
          scale: 1,
          duration: 0.2
        })
        .to(pointsBadgeRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        }, "-=0.2");

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      console.error("Discord modal error:", err);
      // Error shake animation
      gsap.to(modalRef.current, {
        x: [-5, 5, -5, 5, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (isProcessing) return;
    
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isProcessing]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(modalRef.current, { 
        scale: 0, 
        rotation: 5, 
        opacity: 0 
      });
      gsap.set(titleRef.current, { 
        y: -50, 
        opacity: 0, 
        rotation: -5 
      });
      gsap.set(avatarRef.current, { 
        scale: 0, 
        rotation: 180 
      });
      gsap.set(greetingRef.current, { 
        x: -100, 
        opacity: 0 
      });
      gsap.set(messageRef.current, { 
        y: 30, 
        opacity: 0 
      });
      gsap.set(buttonsRef.current, { 
        y: 50, 
        opacity: 0, 
        scale: 0.8 
      });
      gsap.set(speechBubbleRef.current, { 
        scale: 0, 
        rotation: 10 
      });
      gsap.set(pointsBadgeRef.current, { 
        scale: 0, 
        opacity: 0 
      });

      // Entrance animation timeline
      const tl = gsap.timeline();
      
      tl.to(modalRef.current, {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      })
      .to(titleRef.current, {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3")
      .to(avatarRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "bounce.out"
      }, "-=0.2")
      .to(greetingRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3")
      .to(speechBubbleRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, "-=0.2")
      .to(messageRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2")
      .to(buttonsRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
        stagger: 0.1
      }, "-=0.2");

      // Continuous animations
      // Floating animation for modal
      gsap.to(modalRef.current, {
        y: -5,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1
      });

      // Avatar rotation
      gsap.to(avatarRef.current, {
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1,
        delay: 2
      });

      // Speech bubble wiggle
      gsap.to(speechBubbleRef.current, {
        rotation: 2,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5
      });

      // Background dots animation
      backgroundDotsRef.current.forEach((dot, index) => {
        if (dot) {
          gsap.to(dot, {
            y: -10,
            opacity: 0.8,
            duration: 2 + (index * 0.1),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.2
          });
        }
      });

      // Button hover effects
      buttonsRef.current.forEach((button) => {
        if (button) {
          button.addEventListener('mouseenter', () => {
            if (!isProcessing) {
              gsap.to(button, {
                scale: 1.05,
                rotation: 1,
                duration: 0.2,
                ease: "power2.out"
              });
            }
          });
          
          button.addEventListener('mouseleave', () => {
            if (!isProcessing) {
              gsap.to(button, {
                scale: 1,
                rotation: 0,
                duration: 0.2,
                ease: "power2.out"
              });
            }
          });
        }
      });

    }, modalRef);

    return () => ctx.revert();
  }, [isProcessing]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Background Comic Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            ref={el => backgroundDotsRef.current[i] = el}
            className="absolute w-4 h-4 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div
        ref={modalRef}
        className="relative max-w-lg w-full mx-4"
        onClick={handleModalClick}
      >
        {/* Comic Panel Border */}
        <div className="relative bg-white p-6 rounded-2xl border-8 border-black shadow-2xl">
          
          {/* Inner Panel */}
          <div className={`bg-gradient-to-br ${config.color} p-6 rounded-xl border-4 border-black relative overflow-hidden`}>
            
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="comic-dots w-full h-full"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              
              {/* Header Section */}
              <div className="text-center mb-6">
                <h3 
                  ref={titleRef}
                  className="text-3xl font-black text-white font-comic tracking-wider mb-4"
                >
                  {config.emoji} {config.title}
                </h3>
                
                {/* Avatar and Greeting */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div 
                    ref={avatarRef}
                    className="w-16 h-16 rounded-full border-4 border-black overflow-hidden shadow-lg"
                  >
                    <img 
                      src={avatarUrl || "/api/placeholder/64/64"} 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div 
                    ref={greetingRef}
                    className="bg-white text-black p-3 rounded-lg border-4 border-black font-comic font-bold"
                  >
                    {config.greeting}
                  </div>
                </div>

                {/* Speech Bubble */}
                <div 
                  ref={speechBubbleRef}
                  className="bg-yellow-400 text-black p-3 rounded-2xl border-4 border-black font-comic font-bold text-sm mb-4 relative"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <span>Join our awesome community!</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-yellow-400"></div>
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-4">
                <div className={`bg-black bg-opacity-50 p-4 rounded-lg border-2 ${config.borderColor}`}>
                  <div
                    ref={messageRef}
                    className="bg-white border-4 border-black rounded-lg p-4 text-black font-medium font-comic text-center"
                  >
                    {config.message.split('\n').map((line, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    ref={el => buttonsRef.current[0] = el}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                    disabled={isProcessing}
                    className="bg-gray-500 hover:bg-gray-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg border-4 border-black shadow-lg font-comic text-lg"
                  >
                    {config.cancelText}
                  </button>
                  <button
                    ref={el => buttonsRef.current[1] = el}
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirm();
                    }}
                    className={`${
                      isProcessing 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-indigo-500 hover:bg-indigo-400'
                    } text-white font-bold px-6 py-3 rounded-lg border-4 border-black shadow-lg font-comic text-lg disabled:opacity-50`}
                  >
                    {isProcessing ? '⏳ OPENING...' : config.confirmText}
                  </button>
                </div>

                {/* Success Points Badge */}
                {showSuccess && (
                  <div
                    ref={pointsBadgeRef}
                    className="bg-green-400 text-black p-4 rounded-lg border-4 border-black font-comic font-bold text-center text-lg mt-4 transform scale-0"
                  >
                    🎉 +{config.points} POINTS EARNED! 
                    <br />
                    <span className="text-sm">Thanks for joining Discord! 🎮</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Creepster&family=Fredoka+One:wght@400&display=swap');
        
        .font-comic {
          font-family: 'Bangers', 'Fredoka One', cursive;
          letter-spacing: 0.05em;
        }
        
        .comic-dots {
          background-image: 
            radial-gradient(circle at 25% 25%, #fff 3px, transparent 3px),
            radial-gradient(circle at 75% 75%, #fff 2px, transparent 2px);
          background-size: 30px 30px, 20px 20px;
          background-position: 0 0, 15px 15px;
          animation: dotShift 6s ease-in-out infinite;
        }
        
        @keyframes dotShift {
          0%, 100% { background-position: 0 0, 15px 15px; }
          50% { background-position: 10px 10px, 25px 25px; }
        }
      `}</style>
    </div>
  );
};

export default DiscordModal;