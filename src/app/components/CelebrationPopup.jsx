// CelebrationPopup.js
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Character image component - Replace with your actual character image
const CharacterImage = () => (
  <img 
    src="/aura_sticker_2.png" // Replace with your actual image path
    alt="Celebration Character"
    className="w-full h-full object-contain"
  />
);

const CelebrationPopup = ({ 
  show, 
  message = "Post submitted for review! Points coming your way!", 
  onComplete,
  variant = "bubble" // "text" or "bubble"
}) => {
  const containerRef = useRef(null);
  const characterRef = useRef(null);
  const ringsRef = useRef([]);
  const sparklesRef = useRef([]);
  const particlesRef = useRef([]);
  const messageElementRef = useRef(null);
  const morphingBlobsRef = useRef([]);
  const energyWavesRef = useRef([]);
  const prismaticRingsRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    // Create main timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
    });

    timelineRef.current = tl;

    // Set initial states
    gsap.set(containerRef.current, { scale: 0, opacity: 0 });
    gsap.set(characterRef.current, { scale: 0, rotation: 0 });
    gsap.set(ringsRef.current, { rotation: 0, scale: 0.8, opacity: 0 });
    gsap.set(morphingBlobsRef.current, { scale: 0, opacity: 0 });
    gsap.set(energyWavesRef.current, { scale: 0, opacity: 0 });
    gsap.set(prismaticRingsRef.current, { scale: 0, opacity: 0, rotation: 0 });
    gsap.set(sparklesRef.current, { scale: 0, opacity: 0 });
    gsap.set(particlesRef.current, { scale: 0, opacity: 0, y: 0 });
    
    // Set initial state for message element
    if (messageElementRef.current) {
      gsap.set(messageElementRef.current, { scale: 0, opacity: 0, y: 20 });
    }

    // Main animation sequence
    tl
      // Container fade in
      .to(containerRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      
      // Energy explosion sequence
      .to(energyWavesRef.current, {
        scale: 1,
        opacity: 0.8,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      }, 0.1)
      
      // Prismatic rings dramatic entrance
      .to(prismaticRingsRef.current, {
        scale: 1,
        opacity: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(2)"
      }, 0.2)
      
      // Character dramatic entrance
      .to(characterRef.current, {
        scale: 1.2,
        duration: 0.8,
        ease: "back.out(2)",
      }, 0.3)
      
      // Morphing blobs entrance
      .to(morphingBlobsRef.current, {
        scale: 1,
        opacity: 0.6,
        duration: 0.7,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)"
      }, 0.4)
      
      // Character settle
      .to(characterRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      
      // Container scale up
      .to(containerRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "power3.out"
      }, 0.5)
      
      // Legacy rings with new effects
      .to(ringsRef.current, {
        opacity: 0.7,
        scale: 1.1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      }, 0.8)
      
      // Sparkles burst
      .to(sparklesRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: {
          amount: 0.8,
          from: "random"
        },
        ease: "back.out(1.7)"
      }, 1)
      
      // Message animation
      .to(messageElementRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, 1.5)
      
      // Particles launch
      .to(particlesRef.current, {
        scale: 1,
        opacity: 1,
        y: -100,
        duration: 2,
        stagger: {
          amount: 1,
          from: "random"
        },
        ease: "power2.out"
      }, 1.2)
      
      // Particles fade out
      .to(particlesRef.current, {
        opacity: 0,
        scale: 0.5,
        y: -200,
        duration: 1,
        ease: "power2.in"
      }, 2.5)
      
      // Hold for viewing and exit
      .to({}, { duration: 2 })
      .to(containerRef.current, {
        scale: 1.1,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in"
      });

    // Continuous animations
    
    // Character floating
    gsap.to(characterRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: 1
    });

    // Character subtle rotation
    gsap.to(characterRef.current, {
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: 1.5
    });

    // Enhanced rings animations
    ringsRef.current.forEach((ring, index) => {
      if (ring) {
        gsap.to(ring, {
          rotation: 360,
          duration: 4 + index,
          repeat: -1,
          ease: "none",
          delay: 1
        });
        
        // Add pulsing effect
        gsap.to(ring, {
          scale: 1.15,
          opacity: 0.9,
          duration: 2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5 + index * 0.3
        });
      }
    });

    // Morphing blobs continuous animation
    morphingBlobsRef.current.forEach((blob, index) => {
      if (blob) {
        // Rotation
        gsap.to(blob, {
          rotation: index % 2 === 0 ? 360 : -360,
          duration: 8 + index * 2,
          repeat: -1,
          ease: "none",
          delay: 1
        });

        // Scale morphing
        gsap.to(blob, {
          scaleX: 1.3,
          scaleY: 0.8,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.2 + index * 0.4
        });

        // Position drift
        gsap.to(blob, {
          x: (index % 2 === 0 ? 20 : -20),
          y: (index % 3 === 0 ? 15 : -15),
          duration: 4 + index * 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: 1.8 + index * 0.2
        });
      }
    });

    // Energy waves pulsing
    energyWavesRef.current.forEach((wave, index) => {
      if (wave) {
        gsap.to(wave, {
          scale: 1.4,
          opacity: 0.2,
          duration: 2.5 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1 + index * 0.5
        });
      }
    });

    // Prismatic rings complex animation
    prismaticRingsRef.current.forEach((ring, index) => {
      if (ring) {
        // Rotation with varying speeds
        gsap.to(ring, {
          rotation: index % 2 === 0 ? 360 : -360,
          duration: 6 + index * 1.5,
          repeat: -1,
          ease: "none",
          delay: 1
        });

        // Scale breathing
        gsap.to(ring, {
          scale: 1.2,
          duration: 3.5 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.3 + index * 0.2
        });

        // Opacity shimmer
        gsap.to(ring, {
          opacity: 0.4,
          duration: 1.8 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 1.6 + index * 0.1
        });
      }
    });

    // Sparkles twinkling
    sparklesRef.current.forEach((sparkle, index) => {
      if (sparkle) {
        gsap.to(sparkle, {
          scale: 1.5,
          opacity: 0.3,
          duration: 1 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: Math.random() * 2 + 1
        });
      }
    });

    // Message floating animation
    if (messageElementRef.current) {
      gsap.to(messageElementRef.current, {
        y: variant === "bubble" ? -5 : -3,
        duration: variant === "bubble" ? 1.5 : 1.8,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 2
      });
    }

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      gsap.killTweensOf([
        containerRef.current,
        characterRef.current,
        messageElementRef.current,
        ...ringsRef.current.filter(Boolean),
        ...morphingBlobsRef.current.filter(Boolean),
        ...energyWavesRef.current.filter(Boolean),
        ...prismaticRingsRef.current.filter(Boolean),
        ...sparklesRef.current.filter(Boolean),
        ...particlesRef.current.filter(Boolean)
      ].filter(Boolean));
    };
  }, [show, onComplete, variant, message]);

  if (!show) return null;

  // Render the appropriate message element based on variant
  const renderMessage = () => {
    if (variant === "bubble") {
      return (
        <div
          ref={messageElementRef}
          className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl p-4 shadow-2xl border-4 border-blue-300 max-w-xs z-30"
        >
          {/* Speech bubble tail pointing down */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-blue-300 -translate-y-px"></div>
          </div>
          
          <p className="text-sm font-bold text-gray-800 font-comic text-center">
            {message}
          </p>
        </div>
      );
    } else {
      return (
        <div
          ref={messageElementRef}
          className="mt-8 text-center max-w-md"
        >
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/30">
            <p className="text-lg font-bold font-comic tracking-wide">
              {message}
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* Add Comic Neue font */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
        .font-comic {
          font-family: 'Comic Neue', cursive;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/20">
        {/* Background sparkles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              ref={el => sparklesRef.current[i] = el}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 10px rgba(255,255,255,0.8)'
              }}
            />
          ))}
        </div>

        {/* Main celebration container */}
        <div
          ref={containerRef}
          className="relative flex flex-col items-center"
          key={`${variant}-${message}`}
        >
          {/* Energy waves - outermost layer */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`energy-${i}`}
              ref={el => energyWavesRef.current[i] = el}
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255, 107, 107, 0.3) 0%, rgba(78, 205, 196, 0.2) 50%, transparent 70%)`,
                filter: `blur(${15 + i * 5}px)`,
                width: `${150 + i * 40}%`,
                height: `${150 + i * 40}%`,
                left: `${-25 - i * 20}%`,
                top: `${-25 - i * 20}%`,
              }}
            />
          ))}

          {/* Morphing blobs - organic shapes */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`blob-${i}`}
              ref={el => morphingBlobsRef.current[i] = el}
              className="absolute rounded-full"
              style={{
                background: `linear-gradient(${45 + i * 72}deg, 
                  rgba(255, 107, 107, 0.4) 0%, 
                  rgba(78, 205, 196, 0.3) 30%, 
                  rgba(69, 183, 209, 0.4) 60%, 
                  rgba(150, 206, 180, 0.3) 100%)`,
                filter: `blur(${8 + i * 2}px)`,
                borderRadius: `${50 + Math.sin(i) * 30}% ${60 + Math.cos(i) * 25}% ${55 + Math.sin(i + 1) * 20}% ${65 + Math.cos(i + 1) * 30}%`,
                width: `${80 + i * 25}%`,
                height: `${90 + i * 20}%`,
                left: `${-5 - i * 12 + Math.sin(i) * 10}%`,
                top: `${-10 - i * 10 + Math.cos(i) * 8}%`,
                transform: `rotate(${i * 25}deg)`,
              }}
            />
          ))}

          {/* Prismatic rings - geometric precision */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`prismatic-${i}`}
              ref={el => prismaticRingsRef.current[i] = el}
              className="absolute inset-0"
              style={{
                background: `conic-gradient(from ${i * 60}deg, 
                  #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dda0dd, #ff6b6b)`,
                borderRadius: '50%',
                filter: `blur(${4 + i}px)`,
                width: `${100 + i * 30}%`,
                height: `${100 + i * 30}%`,
                left: `${-15 - i * 15}%`,
                top: `${-15 - i * 15}%`,
                clipPath: `polygon(
                  ${20 + i * 5}% 0%, 
                  ${80 - i * 5}% 0%, 
                  100% ${20 + i * 5}%, 
                  100% ${80 - i * 5}%, 
                  ${80 - i * 5}% 100%, 
                  ${20 + i * 5}% 100%, 
                  0% ${80 - i * 5}%, 
                  0% ${20 + i * 5}%
                )`,
              }}
            />
          ))}

          {/* Enhanced legacy rings with modern effects */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              ref={el => ringsRef.current[i] = el}
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, 
                  rgba(255, 107, 107, 0.8), 
                  rgba(78, 205, 196, 0.6), 
                  rgba(69, 183, 209, 0.8), 
                  rgba(150, 206, 180, 0.6), 
                  rgba(255, 234, 167, 0.8), 
                  rgba(255, 107, 107, 0.8))`,
                filter: `blur(${6 + i * 2}px) saturate(1.5) brightness(1.2)`,
                width: `${100 + i * 20}%`,
                height: `${100 + i * 20}%`,
                left: `${-10 - i * 10}%`,
                top: `${-10 - i * 10}%`,
                boxShadow: `inset 0 0 50px rgba(255,255,255,0.3), 0 0 50px rgba(255,255,255,0.2)`,
              }}
            />
          ))}

          {/* Character container */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            {/* Enhanced white light emanation */}
            <div className="absolute inset-0 bg-gradient-radial from-white/40 via-white/20 to-transparent rounded-full blur-2xl animate-pulse" />
            <div className="absolute inset-0 bg-gradient-radial from-blue-200/30 via-purple-200/20 to-transparent rounded-full blur-xl" />
            
            {/* Character image */}
            <div
              ref={characterRef}
              className="relative z-10 w-full h-full drop-shadow-2xl"
            >
              <CharacterImage />
            </div>
          </div>

          {/* Render message based on variant */}
          {renderMessage()}

          {/* Enhanced floating particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`particle-${i}`}
              ref={el => particlesRef.current[i] = el}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: `radial-gradient(circle, ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][i % 5]}, transparent)`,
                boxShadow: `0 0 10px ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][i % 5]}`,
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CelebrationPopup;