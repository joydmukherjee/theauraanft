import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import axios from "axios";

// Register GSAP plugins
gsap.registerPlugin(TextPlugin);

const StudioModal = ({ type, onClose, username, avatarUrl }) => {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Refs for GSAP animations
  const modalRef = useRef(null);
  const titleRef = useRef(null);
  const avatarRef = useRef(null);
  const greetingRef = useRef(null);
  const textareaRef = useRef(null);
  const buttonsRef = useRef([]);
  const backgroundDotsRef = useRef([]);
  const speechBubbleRef = useRef(null);

  const getModalConfig = () => {
    const configs = {
      collab: {
        title: "COLLABORATION REQUEST",
        emoji: "🤝",
        color: "from-yellow-400 to-orange-500",
        borderColor: "border-yellow-400",
        placeholder: "Tell us about your collaboration idea! What kind of project do you have in mind? Let's create something amazing together...",
        icon: "🚀"
      },
      commission: {
        title: "COMMISSION REQUEST",
        emoji: "🎨",
        color: "from-pink-500 to-purple-600",
        borderColor: "border-pink-400",
        placeholder: "Describe your commission request in detail! What style, dimensions, timeline, and budget do you have in mind?",
        icon: "✨"
      },
      learn: {
        title: "PRIVATE STUDIO SESSION",
        emoji: "🎓",
        color: "from-blue-500 to-cyan-600",
        borderColor: "border-blue-400",
        placeholder: "What would you like to learn? 3D modeling, digital art, character design? Tell us your skill level and goals!",
        icon: "💡"
      }
    };
    return configs[type] || configs.collab;
  };

  const config = getModalConfig();

  // Handle backdrop click - only close if clicking the backdrop, not the modal content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent event propagation on modal content
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      // Shake animation for empty textarea
      gsap.to(textareaRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
      return;
    }

    setSubmitting(true);
    
    // Button loading animation
    gsap.to(buttonsRef.current[1], {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    try {
      const formData = {
        type,
        description,
        avatar_url: avatarUrl
      };

      const res = await axios.post("/api/save_studio_j", {
        formData,
        username,
      });

      if (res.data.success) {
        setSubmitted(true);
        
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
          });

        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Error shake animation
      gsap.to(modalRef.current, {
        x: [-5, 5, -5, 5, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle textarea change with event prevention
  const handleTextareaChange = (e) => {
    e.stopPropagation();
    setDescription(e.target.value);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
      gsap.set(textareaRef.current, { 
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
      .to(textareaRef.current, {
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
            gsap.to(button, {
              scale: 1.05,
              rotation: 1,
              duration: 0.2,
              ease: "power2.out"
            });
          });
          
          button.addEventListener('mouseleave', () => {
            gsap.to(button, {
              scale: 1,
              rotation: 0,
              duration: 0.2,
              ease: "power2.out"
            });
          });
        }
      });

    }, modalRef);

    return () => ctx.revert();
  }, []);

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
                    Hey <span className="text-purple-600">{username || "Friend"}</span>! 👋
                  </div>
                </div>

                {/* Speech Bubble */}
                <div 
                  ref={speechBubbleRef}
                  className="bg-yellow-400 text-black p-3 rounded-2xl border-4 border-black font-comic font-bold text-sm mb-4 relative"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <span>Let's make something awesome together!</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-yellow-400"></div>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-4">
                <div className={`bg-black bg-opacity-50 p-4 rounded-lg border-2 ${config.borderColor}`}>
                  <textarea
                    ref={textareaRef}
                    className="w-full bg-white border-4 border-black rounded-lg p-4 text-black font-medium min-h-[120px] focus:outline-none focus:ring-4 focus:ring-yellow-400 resize-none"
                    placeholder={config.placeholder}
                    value={description}
                    onChange={handleTextareaChange}
                    onFocus={(e) => e.stopPropagation()}
                    onBlur={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    ref={el => buttonsRef.current[0] = el}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold px-6 py-3 rounded-lg border-4 border-black shadow-lg font-comic text-lg"
                  >
                    ❌ CANCEL
                  </button>
                  <button
                    ref={el => buttonsRef.current[1] = el}
                    disabled={submitting}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit();
                    }}
                    className={`${
                      submitting 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-400'
                    } text-white font-bold px-6 py-3 rounded-lg border-4 border-black shadow-lg font-comic text-lg disabled:opacity-50`}
                  >
                    {submitting ? '⏳ SENDING...' : `🚀 SEND ${type?.toUpperCase() || 'REQUEST'}`}
                  </button>
                </div>

                {/* Success Message */}
                {submitted && (
                  <div
                    className="bg-green-400 text-black p-4 rounded-lg border-4 border-black font-comic font-bold text-center text-lg mt-4"
                  >
                    🎉 SUCCESS! Your request has been sent!
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
        
        /* Scrollbar styling for textarea */
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
          border: 2px solid #000;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default StudioModal;