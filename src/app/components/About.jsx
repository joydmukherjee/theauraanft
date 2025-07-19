import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Tilt from 'react-parallax-tilt';

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
  <Tilt
  className="xs:w-[250px]"
  tiltMaxAngleX={45}
  tiltMaxAngleY={45}
  scale={1}
  transitionSpeed={450}
  glareEnable={false} // optional
>
  <motion.div
    variants={fadeIn("right", "spring", index * 0.5, 0.75)}
    className="w-[300px] md:w-[400px] bg-gradient-to-br from-purple-600 to-pink-600 p-[4px] rounded-2xl border-4 border-black shadow-2xl"
  >
    <div
      className="bg-white rounded-xl min-h-[250px] md:min-h-[300px] flex flex-col justify-center items-center border-2 border-black relative overflow-hidden"
    >
      {/* Comic dots */}
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

      {/* Main image */}
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

      {/* Fallback placeholder */}
      <div
        className="w-full h-full min-h-[250px] md:min-h-[300px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center relative z-10"
        style={{ display: 'none' }}
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

    // ⚡ INSTANT TEXT APPEARANCE - NO STAGGERED ANIMATIONS
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
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
      speechBubbleRef.current,
      servicesGridRef.current
    ], {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotation: 0,
      duration: 0.4, // Single fast animation
      ease: "power2.out"
    });

    // 🎯 MINIMAL MOVEMENT - BARELY NOTICEABLE FOR BOTH PANELS
    // Very subtle breathing effect for left panel - SAME AS RIGHT
    gsap.to(leftPanelRef.current, {
      y: -0.5, // 🎯 EXTREMELY SUBTLE
      rotation: 0.1, // 🎯 BARELY VISIBLE
      duration: 10, // 🎯 VERY SLOW - SAME AS RIGHT
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1 // Slight offset from right panel
    });

    gsap.to(rightPanelRef.current, {
      y: -0.5, // 🎯 EXTREMELY SUBTLE
      rotation: -0.1, // 🎯 BARELY VISIBLE
      duration: 10, // 🎯 VERY SLOW
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2
    });

    // Remove additional right panel movement entirely
    // (commented out the x-axis movement)

    // Remove title text color animation entirely
    // (commented out the color animation)

    // Remove speech bubble wiggle entirely
    // (commented out the speech bubble rotation)

    // Button hover animations - FASTER AND MORE SUBTLE
    buttonsRef.current.forEach((button) => {
      if (button) {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05, // 🎯 MORE SUBTLE (was 1.1)
            rotation: 1, // 🎯 MORE SUBTLE (was 2)
            duration: 0.2, // ⚡ FASTER (was 0.3)
            ease: "power2.out"
          });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            rotation: 0,
            duration: 0.2, // ⚡ FASTER (was 0.3)
            ease: "power2.out"
          });
        });
      }
    });

    // Typing effect for speech bubble - KEEP THE TYPING EFFECT
    const speechText = speechBubbleRef.current?.querySelector('.speech-text');
    if (speechText) {
      gsap.to(speechText, {
        text: "BREAK THE CODE.",
        duration: 1.5, // Nice typing speed
        ease: "none",
        delay: 1 // Start shortly after content appears
      });
    }

  }, containerRef);

  return () => ctx.revert();
}, []);


return (
  <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 sm:p-6 md:p-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 h-full">

        {/* Left Panel - Text Content */}
        <div ref={leftPanelRef} className="relative">
          <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-2xl border-8 border-black shadow-2xl">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 sm:p-6 md:p-8 rounded-xl border-4 border-black relative overflow-hidden min-h-[60vh]">
              
              {/* Comic Dots */}
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
                <div className="relative mb-6 sm:mb-8">
                  <h2 ref={titleRef} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white text-center font-comic tracking-wider">
                    WELCOME
                  </h2>
                  <div ref={subtitleRef} className="bg-yellow-400 text-black text-xl sm:text-2xl lg:text-3xl font-black px-4 py-2 rounded-lg mt-2 text-center border-4 border-black">
                    TO AURA
                  </div>
                </div>

                <div className="space-y-4 text-white">
                  {[...Array(8)].map((_, i) => {
                    // Custom handling for BREAK THE CODE section
                    if (i === 7) {
                      return (
                        <div
                          key={i}
                          ref={el => contentSectionsRef.current[i] = el}
                          className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-6 sm:p-4 rounded-lg border-[4px] border-black relative overflow-hidden shadow-md"
                        >
                          <p className="text-3xl sm:text-2xl font-black text-black text-center font-comic tracking-wider drop-shadow-sm">
                            BREAK THE CODE.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={i}
                        ref={el => contentSectionsRef.current[i] = el}
                        className={`bg-black bg-opacity-${i === 6 ? "70" : "50"} p-3 sm:p-4 md:p-4 rounded-lg ${
                          i === 6 ? "border-4 border-red-400" : `border-2 ${
                            [
                              "border-yellow-400",
                              "border-pink-400",
                              "border-blue-400",
                              "border-green-400",
                              "border-orange-400",
                              "border-cyan-400"
                            ][i]
                          }`
                        } relative overflow-hidden`}
                      >
                        <div className="comic-dots absolute inset-0 opacity-10" />
                        <p className={`${i === 6 ? "text-2xl font-black text-red-400 text-center font-comic" : "text-lg font-medium"} relative z-10`}>
                          {[
                            <><span className="text-yellow-400 font-bold">Aura is a universe born from story...</span> inspired by comics, shaped by myth, and powered by transformation.</>,
                            <><span className="text-pink-400 font-bold">But this story doesn't live in books.</span> It lives on-chain.</>,
                            <><span className="text-blue-400 font-bold">Every collectible is more than art:</span> it's a pass to the future, character with purpose, a presence in a living world.</>,
                            <><span className="text-green-400 font-bold">In Web3, you don't follow a story...</span> you become part of it. Your Aura begins to form.</>,
                            <><span className="text-orange-400 font-bold">And then it grows...</span> into a 3D identity, into a VR-ready version of you.</>,
                            <>We grow with the community. We educate, we open opportunities. We create a space where everyone matters.</>,
                            <>AURA DOES NOT BUILD FOR THE FUTURE. IT OWNS THE FUTURE.</>
                          ][i]}
                        </p>
                      </div>
                    );
                  })}
                </div>

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
          <div className="relative bg-white p-4 sm:p-6 md:p-8 rounded-2xl border-8 border-black shadow-2xl h-[60vh] sm:h-[70vh] md:h-full">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-xl border-4 border-black h-full flex items-center justify-center relative overflow-hidden">
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

              <div className="relative z-10 w-full h-full">
                <img
                  src="/comic2.png"
                  alt="Aura Universe Comic"
                  className="w-full h-full object-cover object-top rounded-lg border-4 border-black shadow-xl"
                />
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

        <div className="ml-4 sm:ml-20 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-1 justify-evenly gap-10 sm:gap-16">
          {services && services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  </div>
);


};

export default SectionWrapper(About, "about");