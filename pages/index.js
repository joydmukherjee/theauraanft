import React, { useState, useEffect } from "react";
import {
  About,
  Lore,
  //Showcase,
  Mint,
  Roadmap,
  Community,
  CommunityV1,
  CommunityV2,
  CommunityV3,
  Studio,
  Teams,
  Hero,
  Navbar,
  Tech,
  Utility,
  StarsCanvas,
} from "../src/app/components";

const HomePage = () => {
  console.log("HomePage");
  const [showMint, setShowMint] = useState(false); /// toggle the display of the mint here.
  const [isMuted, setIsMuted] = useState(true); //To toggle the sound of the video on user interaction
  const [isMobile, setIsMobile] = useState(null); // Track mobile state

  // Detect mobile viewport
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)"); // You can adjust this breakpoint
    setIsMobile(mediaQuery.matches);
    
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    
    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  const handleToggleSound = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar isMuted={isMuted} onToggleSound={handleToggleSound} />
        <Hero isMuted={isMuted} />
      </div>
      {showMint === true && <Mint />}

      <About />
      <Lore />
      {/* <Showcase /> */}
      {/* <Utility /> */}
      <Roadmap />
      <Community />
      {/* <CommunityV1 /> */}
      {/* <CommunityV2 /> */}
      {/* <CommunityV3 /> */}
      {/* <MintVersion2 /> */}
      <Studio />
      <Teams />

      {/* Only render Tech component on desktop to avoid mobile lag */}
      {isMobile !== null && !isMobile && (
        <div className="relative z-0">
          <Tech />
          {/* <StarsCanvas /> */}
        </div>
      )}

      {/* Optional: Add a mobile-friendly alternative or message */}
      {isMobile && (
        <div className="relative z-0 py-20">
          <div className="flex flex-col items-center text-center px-6">
            <p className="mt-10 text-white text-lg">
              Made with <span style={{ color: "red" }}>{"\u2764"}</span> in
              Infiniverse Labs
            </p>
            <p className="mt-4 text-gray-400 text-sm">
              View on desktop for interactive tech showcase
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;