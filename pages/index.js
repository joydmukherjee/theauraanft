import React,{ useState} from "react";
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
  const [showMint,setShowMint] = useState(false);/// toggle the display of the mint here.
   const [isMuted, setIsMuted] = useState(true);//To toggle the sound of the video on user interaction

    const handleToggleSound = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="relative z-0 bg-primary">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar isMuted={isMuted} onToggleSound={handleToggleSound}/>
        <Hero isMuted={isMuted}/>
      </div>
      {
        showMint===true &&
        <Mint/>
      }
      
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

      <div className="relative z-0">
        <Tech />
        {/* <StarsCanvas /> */}
      </div>
    </div>
  );
};

export default HomePage;
