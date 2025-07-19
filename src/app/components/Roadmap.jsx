import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const RoadmapCard = ({ experience, index }) => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const contentRef = useRef(null);

 useEffect(() => {
  const ctx = gsap.context(() => {
    // Set initial state - hide elements
    gsap.set(cardRef.current, { 
      opacity: 0, 
      y: 100, 
      rotation: index % 2 === 0 ? 5 : -5,
      scale: 0.8
    });
    gsap.set(iconRef.current, { 
      scale: 0, 
      rotation: 180 
    });
    gsap.set(contentRef.current, { 
      x: index % 2 === 0 ? -50 : 50, 
      opacity: 0 
    });

    // ⚡ INSTANT APPEARANCE - NO STAGGERED ANIMATIONS
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    });

    // Everything appears at once - no delays or staggers
    tl.to([
      cardRef.current,
      iconRef.current,
      contentRef.current
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
    // Continuous floating animation - MUCH SLOWER
    gsap.to(cardRef.current, {
      y: -5, // Keep same movement amount
      rotation: index % 2 === 0 ? 1 : -1, // Keep same rotation
      duration: 8 + (index * 0.5), // 🐌 MUCH SLOWER (was 3 + index * 0.2)
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: index * 1 // Slightly longer delay between cards
    });

    // Icon rotation animation - MUCH SLOWER
    gsap.to(iconRef.current, {
      rotation: 360,
      duration: 60, // 🐌 MUCH SLOWER (was 20)
      ease: "none",
      repeat: -1
    });

  }, cardRef);

  return () => ctx.revert();
}, [index]);

  const isLeft = index % 2 === 0;
  const cardColors = [
    'from-purple-600 to-pink-600',
    'from-blue-600 to-cyan-600',
    'from-green-600 to-emerald-600',
    'from-orange-600 to-red-600',
    'from-indigo-600 to-purple-600'
  ];
  const borderColors = [
    'border-pink-400',
    'border-cyan-400',
    'border-emerald-400',
    'border-red-400',
    'border-purple-400'
  ];

  return (
    <div className={`flex items-center mb-16 relative
                     ${isLeft ? 'flex-row' : 'flex-row-reverse'} 
                     max-md:flex-row`}>
      {/* Timeline Icon - Responsive positioning */}
      <div className="absolute z-20
                      left-1/2 transform -translate-x-1/2
                      md:left-1/2 md:transform md:-translate-x-1/2  
                      max-md:left-8 max-md:transform max-md:-translate-x-1/2">
        <div 
          ref={iconRef}
          className="w-16 h-16 bg-white rounded-full border-8 border-black shadow-2xl flex items-center justify-center"
          style={{ background: experience.iconBg }}
        >
          <img
            src={experience.icon}
            alt={experience.title}
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* Card Content - Responsive layout */}
      <div 
        ref={cardRef}
        className={`w-5/12 
                    ${isLeft ? 'mr-auto pr-8' : 'ml-auto pl-8'}
                    max-md:w-full max-md:ml-20 max-md:mr-4 max-md:pl-0 max-md:pr-0`}
      >
        {/* Comic Panel Border */}
        <div className="relative bg-white p-4 rounded-2xl border-8 border-black shadow-2xl">
          
          {/* Inner Panel */}
          <div className={`bg-gradient-to-br ${cardColors[index % cardColors.length]} p-6 rounded-xl border-4 border-black relative overflow-hidden`}>
            
            {/* Animated Comic Book Dots Pattern */}
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
            
            {/* Content */}
            <div ref={contentRef} className="relative z-10">
              {/* Date Badge */}
              <div className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg mb-4 border-4 border-black inline-block font-comic">
                {experience.date}
              </div>
              
              {/* Title */}
              <h3 className="text-white text-2xl font-black mb-4 font-comic">
                {experience.title}
              </h3>
              
              {/* Points */}
              <div className="space-y-3">
                {experience.points.map((point, pointIndex) => {
                  const isStrikethrough = point.strikethrough;
                  return (
                    <div 
                      key={pointIndex}
                      className={`bg-black bg-opacity-50 p-3 rounded-lg border-2 ${borderColors[pointIndex % borderColors.length]} relative overflow-hidden`}
                    >
                      <div className="comic-dots absolute inset-0 opacity-10"></div>
                      <p 
                        className={`text-white font-medium relative z-10 ${isStrikethrough ? 'line-through opacity-60' : ''}`}
                      >
                        {point.text}
                      </p>
                      {/* Completion Badge */}
                      {isStrikethrough && (
                        <div className="absolute top-2 right-2 bg-green-400 text-black text-xs font-bold px-2 py-1 rounded border-2 border-black">
                          ✓ DONE
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Roadmap = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const speechBubbleRef = useRef(null);

  useEffect(() => {
  const ctx = gsap.context(() => {
    // Initial setup - hide elements
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
    gsap.set(speechBubbleRef.current, { 
      scale: 0, 
      rotation: 10, 
      transformOrigin: "bottom center" 
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
      titleRef.current,
      subtitleRef.current,
      speechBubbleRef.current
    ], {
      opacity: 1,
      x: 0,
      scale: 1,
      rotation: 0,
      duration: 0.4, // Single fast animation
      ease: "power2.out"
    });

    // 🐌 MUCH SLOWER CONTINUOUS ANIMATIONS
    // Title text color animation - MUCH SLOWER
    gsap.to(titleRef.current, {
      color: "#fbbf24", // yellow-400
      duration: 6, // 🐌 MUCH SLOWER (was 2)
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 3 // Longer delay
    });

    // Speech bubble wiggle - MUCH SLOWER
    gsap.to(speechBubbleRef.current, {
      rotation: 2, // Keep same rotation amount
      duration: 4, // 🐌 MUCH SLOWER (was 1.5)
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 5 // Longer delay
    });

    // Typing effect for speech bubble - keep the typing effect
    const speechText = speechBubbleRef.current?.querySelector('.speech-text');
    if (speechText) {
      gsap.to(speechText, {
        text: "THE JOURNEY TO GREATNESS!",
        duration: 2, // Keep typing effect visible
        ease: "none",
        delay: 2 // Start shortly after content appears
      });
    }

  }, containerRef);

  return () => ctx.revert();
}, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      
      {/* Title Section */}
      <div className="max-w-7xl mx-auto text-center mb-20">
        {/* Comic Panel Border for Title */}
        <div className="relative bg-white p-8 rounded-2xl border-8 border-black shadow-2xl inline-block">
          
          {/* Inner Panel */}
          <div className="bg-gradient-to-br from-red-600 to-orange-600 p-8 rounded-xl border-4 border-black relative overflow-hidden">
            
            {/* Animated Comic Book Dots Pattern */}
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
            
            {/* Title Content */}
            <div className="relative z-10">
              <h2 ref={titleRef} className="text-6xl font-black text-white font-comic tracking-wider mb-4">
                ROADMAP
              </h2>
              <div ref={subtitleRef} className="bg-yellow-400 text-black text-2xl font-black px-6 py-2 rounded-lg border-4 border-black inline-block">
                OUR EPIC JOURNEY
              </div>
            </div>
          </div>
        </div>

        {/* Speech Bubble */}
        <div 
          ref={speechBubbleRef}
          className="relative mt-8 bg-white text-black p-4 rounded-2xl border-4 border-black font-comic font-bold text-lg max-w-xs mx-auto"
        >
          <div className="relative">
            <span className="speech-text"></span>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>
          </div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="max-w-6xl mx-auto relative">
        {/* Continuous Timeline Line - Responsive positioning */}
        <div className="absolute w-1 bg-gradient-to-b from-yellow-400 to-purple-600 z-10 top-8 bottom-16 
                        left-1/2 transform -translate-x-1/2 
                        md:left-1/2 md:transform md:-translate-x-1/2
                        max-md:left-8 max-md:transform-none"></div>
        
        {experiences.map((experience, index) => (
          <RoadmapCard
            key={`roadmap-${index}`}
            experience={experience}
            index={index}
          />
        ))}
      </div>

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
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .roadmap-card {
            flex-direction: column !important;
          }
          
          .roadmap-card > div {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SectionWrapper(Roadmap, "roadmap");