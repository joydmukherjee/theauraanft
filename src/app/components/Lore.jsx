import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Tilt from "react-tilt";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Lore = () => {
  const titleRef = useRef(null);
  const comicPanelRef = useRef(null);
  const storyRef = useRef(null);
  const imageRef = useRef(null);
  const paragraphsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    // Title animation
    tl.fromTo(titleRef.current, 
      { x: 1500, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.75, delay: 0.5, ease: "back.out(1.7)" }
    );

    // Comic panel animation
    gsap.fromTo(comicPanelRef.current,
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: comicPanelRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Story content animation
    gsap.fromTo(storyRef.current,
      { x: -50, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Image animation
    gsap.fromTo(imageRef.current,
      { x: 50, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 1,
        delay: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Stagger paragraphs animation
    gsap.fromTo(paragraphsRef.current,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* LORE Title - Keep as original */}
      <div 
        ref={titleRef}
        className="relative w-fit mb-16"
      >
        {/* White background box */}
        <div className="skew-x-[-15deg] px-20 py-8 z-0 relative bg-white">
          {/* Placeholder to give it shape */}
          <div className="invisible">Placeholder</div>
        </div>

        {/* Purple overlay box */}
        <div className="absolute top-[-10px] left-[-14px] z-10 skew-x-[-15deg] px-20 py-6 shadow-lg" style={{ backgroundColor: '#bf52de' }}>
          <h2 className="text-white text-4xl font-bold skew-x-[-12deg]">LORE</h2>
        </div>
      </div>

      {/* Comic Panel Container */}
      <div
        ref={comicPanelRef}
        className="relative max-w-7xl mx-auto"
      >
        {/* Main Comic Panel */}
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-8 rounded-3xl border-8 border-white shadow-2xl overflow-hidden">
          {/* Comic Panel Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 opacity-20 rounded-2xl"></div>
          
          {/* Halftone Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>

          {/* Content Grid */}
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            
            {/* Left Side - Story Content */}
            <div ref={storyRef} className="space-y-6">
              {/* Story Title */}
              <h3
                ref={el => paragraphsRef.current[0] = el}
                className="text-yellow-300 text-3xl font-black tracking-wider mb-8 drop-shadow-lg"
                style={{ 
                  fontFamily: 'Impact, "Arial Black", sans-serif',
                  textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
                }}
              >
                THE STORY THAT STARTED IT ALL!
              </h3>

              {/* Story Paragraphs */}
              <div className="space-y-4 text-white leading-relaxed">
                <p
                  ref={el => paragraphsRef.current[1] = el}
                  className="text-lg font-bold"
                  style={{ 
                    fontFamily: '"Comic Sans MS", "Marker Felt", fantasy',
                    textShadow: '2px 2px 0px #000'
                  }}
                >
                  In the quiet mountain village of Gokarna, a gifted disciple named Kris was training under a wise old monk, alongside his friends and fellow disciples. He was unaware of the storm that was coming...one that would change the course of his life forever.
                </p>

                <p
                  ref={el => paragraphsRef.current[2] = el}
                  className="text-lg font-bold text-red-300"
                  style={{ 
                    fontFamily: '"Comic Sans MS", "Marker Felt", fantasy',
                    textShadow: '2px 2px 0px #000'
                  }}
                >
                  One night, the sky ripped open with fire as an army of masked assassins descended upon the temple, sent by a tyrannical warlord known only as "The Destroyer".
                </p>

                <p
                  ref={el => paragraphsRef.current[3] = el}
                  className="text-lg font-bold text-orange-300"
                  style={{ 
                    fontFamily: '"Comic Sans MS", "Marker Felt", fantasy',
                    textShadow: '2px 2px 0px #000'
                  }}
                >
                  All the students were slaughtered one by one in a brutal, haunting massacre. When the monk fell protecting his people, Kris's buried rage and pain erupted...unleashing a dormant power within him: The Aura.
                </p>

                <p
                  ref={el => paragraphsRef.current[4] = el}
                  className="text-lg font-bold text-blue-300"
                  style={{ 
                    fontFamily: '"Comic Sans MS", "Marker Felt", fantasy',
                    textShadow: '2px 2px 0px #000'
                  }}
                >
                  He saved countless lives with that power. He eliminated the army of assassins.
                </p>

                <p
                  ref={el => paragraphsRef.current[5] = el}
                  className="text-lg font-bold text-green-300"
                  style={{ 
                    fontFamily: '"Comic Sans MS", "Marker Felt", fantasy',
                    textShadow: '2px 2px 0px #000'
                  }}
                >
                  After the battle, he found his mentor...dying. Tears rolled down Kris's face as he held the man he had adored all his life. With his final breath, the monk whispered: "Your real parents are alive. They've been imprisoned by the very Destroyer who tried to kill you."
                </p>

                <p
                  ref={el => paragraphsRef.current[6] = el}
                  className="text-lg font-bold text-purple-300"
                  style={{ 
                    fontFamily: '"Comic Sans MS", "Marker Felt", fantasy',
                    textShadow: '2px 2px 0px #000'
                  }}
                >
                  Marked by vengeance and fueled by the truth, the boy set out on a journey. With fire in his soul and a power he barely understood, he vowed to uncover who he truly is, rescue those he loves, and confront the faceless monster terrorizing the world.
                </p>

                <p
                  ref={el => paragraphsRef.current[7] = el}
                  className="text-2xl font-black text-yellow-400 text-center py-4"
                  style={{ 
                    fontFamily: 'Impact, "Arial Black", sans-serif',
                    textShadow: '4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000'
                  }}
                >
                  He sets out to BREAK THE CODE.
                </p>
              </div>
            </div>

            {/* Right Side - Comic Image */}
            <div
              ref={imageRef}
              className="relative"
            >
              {/* Image Container with Comic Border */}
              <div className="relative">
                {/* Comic Border Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 rounded-2xl opacity-80 blur-sm"></div>
                
                {/* Image */}
                <div className="relative bg-black rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                  <img 
                    src="/monk_b.png" 
                    alt="Comic Book Illustration" 
                    className="w-full h-auto object-cover rounded-xl"
                    style={{
                      filter: 'contrast(1.2) saturate(1.3)',
                      imageRendering: 'crisp-edges'
                    }}
                  />
                  
                  {/* Comic Book Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl"></div>
                </div>

                {/* Action Lines Effect */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-500 rounded-full opacity-80 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>

          {/* Comic Panel Gutter Lines */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-white opacity-30 hidden lg:block"></div>
          
          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-yellow-400 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-yellow-400 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-purple-500 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-purple-500 rounded-br-lg"></div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Lore, "lore");