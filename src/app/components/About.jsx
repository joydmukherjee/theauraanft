import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Tilt from "react-tilt";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="xs:w-[250px]">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-[300px] md:w-[400px] bg-gradient-to-br from-purple-600 to-pink-600 p-[4px] rounded-2xl border-4 border-black shadow-2xl"
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-white rounded-xl min-h-[250px] md:min-h-[300px] flex flex-col justify-center items-center border-2 border-black relative overflow-hidden"
      >
        {/* Comic dots pattern - positioned behind image */}
        <div className="absolute inset-0 opacity-10 z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="comic-dot absolute w-2 h-2 bg-purple-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Image - stretched to fill the entire card */}
        {icon && (
          <img
            src={icon}
            alt={title || "service-icon"}
            className="w-full h-full min-h-[250px] md:min-h-[300px] object-cover relative z-10 rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        )}
        
        {/* Fallback placeholder - also stretched */}
        <div 
          className="w-full h-full min-h-[250px] md:min-h-[300px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center relative z-10" 
          style={{display: 'none'}}
        >
          <div className="text-center text-white">
            <div className="text-4xl mb-2">🎨</div>
            <p className="font-comic font-bold">COMING SOON</p>
          </div>
        </div>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  // Refs for GSAP animations
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const contentSectionsRef = useRef([]);
  const buttonsRef = useRef([]);
  const speechBubbleRef = useRef(null);
  const servicesGridRef = useRef(null);

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
      gsap.set(servicesGridRef.current, {
        y: 100,
        opacity: 0
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

      // Panel entrance animations
      tl.to([leftPanelRef.current, rightPanelRef.current], {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        stagger: 0.2
      })
      // Title animation with bounce effect
      .to(titleRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "bounce.out"
      }, "-=0.8")
      // Subtitle slide in
      .to(subtitleRef.current, {
        x: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      // Content sections staggered entrance
      .to(contentSectionsRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.15
      }, "-=0.3")
      // Button pop in
      .to(buttonsRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        stagger: 0.1
      }, "-=0.2")
      // Speech bubble pop
      .to(speechBubbleRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.6")
      // Services grid entrance
      .to(servicesGridRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.2");

      // Continuous animations
      // Floating animation for panels (flipped)
      gsap.to(leftPanelRef.current, {
        y: -3,
        rotation: 0.5,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      gsap.to(rightPanelRef.current, {
        y: -20,
        rotation: -2,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5
      });

      // Additional right panel movement
      gsap.to(rightPanelRef.current, {
        x: 5,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1
      });

      // Title text color animation
      gsap.to(titleRef.current, {
        color: "#fbbf24", // yellow-400
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
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
        delay: 3
      });

      // Button hover animations
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

      // Typing effect for speech bubble
      const speechText = speechBubbleRef.current?.querySelector('.speech-text');
      if (speechText) {
        gsap.to(speechText, {
          text: "BREAK THE CODE.",
          duration: 2,
          ease: "none",
          delay: 4
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      {/* Comic Book Style Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left Panel - Text Content */}
          <div ref={leftPanelRef} className="relative">
            {/* Comic Panel Border */}
            <div className="relative bg-white p-8 rounded-2xl border-8 border-black shadow-2xl">
              
              {/* Inner Panel */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-xl border-4 border-black relative overflow-hidden">
                
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
                <div className="relative z-10">
                  {/* Title */}
                  <div className="relative mb-8">
                    <h2 ref={titleRef} className="text-5xl lg:text-6xl font-black text-white text-center font-comic tracking-wider">
                      WELCOME
                    </h2>
                    <div ref={subtitleRef} className="bg-yellow-400 text-black text-2xl lg:text-3xl font-black px-4 py-2 rounded-lg mt-2 text-center border-4 border-black">
                      TO AURA
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-4 text-white">
                    <div 
                      ref={el => contentSectionsRef.current[0] = el}
                      className="bg-black bg-opacity-50 p-4 rounded-lg border-2 border-yellow-400 relative overflow-hidden"
                    >
                      <div className="comic-dots absolute inset-0 opacity-10"></div>
                      <p className="text-lg font-medium relative z-10">
                        <span className="text-yellow-400 font-bold">Aura is a universe born from story...</span> inspired by comics, shaped by myth, and powered by transformation.
                      </p>
                    </div>

                    <div 
                      ref={el => contentSectionsRef.current[1] = el}
                      className="bg-black bg-opacity-50 p-4 rounded-lg border-2 border-pink-400 relative overflow-hidden"
                    >
                      <div className="comic-dots absolute inset-0 opacity-10"></div>
                      <p className="text-lg font-medium relative z-10">
                        <span className="text-pink-400 font-bold">But this story doesn't live in books.</span> It lives on-chain.
                      </p>
                    </div>

                    <div 
                      ref={el => contentSectionsRef.current[2] = el}
                      className="bg-black bg-opacity-50 p-4 rounded-lg border-2 border-blue-400 relative overflow-hidden"
                    >
                      <div className="comic-dots absolute inset-0 opacity-10"></div>
                      <p className="text-lg font-medium relative z-10">
                        <span className="text-blue-400 font-bold">Every collectible is more than art:</span> it's a pass to the future, character with purpose, a presence in a living world.
                      </p>
                    </div>

                    <div 
                      ref={el => contentSectionsRef.current[3] = el}
                      className="bg-black bg-opacity-50 p-4 rounded-lg border-2 border-green-400 relative overflow-hidden"
                    >
                      <div className="comic-dots absolute inset-0 opacity-10"></div>
                      <p className="text-lg font-medium relative z-10">
                        <span className="text-green-400 font-bold">In Web3, you don't follow a story...</span> you become part of it. Your Aura begins to form.
                      </p>
                    </div>

                    <div 
                      ref={el => contentSectionsRef.current[4] = el}
                      className="bg-black bg-opacity-50 p-4 rounded-lg border-2 border-orange-400 relative overflow-hidden"
                    >
                      <div className="comic-dots absolute inset-0 opacity-10"></div>
                      <p className="text-lg font-medium relative z-10">
                        <span className="text-orange-400 font-bold">And then it grows...</span> into a 3D identity, into a VR-ready version of you.
                      </p>
                    </div>

                    {/* Additional content sections */}
                    <div 
                      ref={el => contentSectionsRef.current[5] = el}
                      className="bg-black bg-opacity-50 p-4 rounded-lg border-2 border-cyan-400 relative overflow-hidden"
                    >
                      <div className="comic-dots absolute inset-0 opacity-10"></div>
                      <p className="text-lg font-medium relative z-10">
                        We grow with the community. We educate, we open opportunities. We create a space where everyone matters.
                      </p>
                    </div>

                    <div 
                      ref={el => contentSectionsRef.current[6] = el}
                      className="bg-black bg-opacity-70 p-6 rounded-lg border-4 border-red-400 relative overflow-hidden"
                    >
                      <div className="comic-dots absolute inset-0 opacity-10"></div>
                      <p className="text-2xl font-black text-red-400 text-center relative z-10 font-comic">
                        AURA DOES NOT BUILD FOR THE FUTURE. IT OWNS THE FUTURE.
                      </p>
                    </div>

                    <div 
                      ref={el => contentSectionsRef.current[7] = el}
                      className="bg-gradient-to-r from-yellow-400 to-red-500 p-6 rounded-lg border-4 border-black relative overflow-hidden"
                    >
                      <p className="text-3xl font-black text-black text-center font-comic">
                        BREAK THE CODE.
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center mt-8">
                    <Link href="/Details">
                      <button 
                        ref={el => buttonsRef.current[0] = el}
                        className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-lg border-4 border-black shadow-lg font-comic text-xl"
                      >
                        🚀 LEARN MORE...
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Image */}
          <div ref={rightPanelRef} className="relative">
            {/* Comic Panel Border */}
            <div className="relative bg-white p-8 rounded-2xl border-8 border-black shadow-2xl h-full">
              
              {/* Inner Panel */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-xl border-4 border-black h-full flex items-center justify-center relative overflow-hidden">
                
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
                    src="/comic2.png" 
                    alt="Aura Universe Comic" 
                    className="w-full h-full object-cover rounded-lg border-4 border-black shadow-xl" 
                  />
                  
                  {/* Animated Comic Speech Bubble */}
                  <div 
                    ref={speechBubbleRef}
                    className="absolute top-4 right-4 bg-white text-black p-3 rounded-2xl border-4 border-black font-comic font-bold text-sm max-w-xs"
                  >
                    <div className="relative">
                      <span className="speech-text"></span>
                      <div className="absolute -bottom-2 -right-2 w-0 h-0 border-l-8 border-l-white border-t-8 border-t-transparent border-b-8 border-b-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid Section */}
        <div ref={servicesGridRef} className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black text-white font-comic mb-4">DISCOVER THE UNIVERSE</h3>
            <div className="bg-yellow-400 text-black text-xl font-bold px-6 py-2 rounded-lg inline-block border-4 border-black">
              Our Collection
            </div>
          </div>
          
          <div className="ml-20 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-1 justify-evenly gap-16">
            {services && services.map((service, index) => (
              <ServiceCard key={service.title} index={index} {...service} />
            ))}
          </div>
        </div>
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
        
        /* Button press animation */
        .btn-press {
          animation: buttonPress 0.2s ease-in-out;
        }
        
        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SectionWrapper(About, "about");