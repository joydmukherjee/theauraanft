import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import dynamic from "next/dynamic";
import CanvasLoader from "../Loader";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

const Octos = ({ isMobile, onModelLoaded }) => {
  // Only load the model on desktop - skip entirely on mobile
  const { scene } = !isMobile ? useGLTF("./high_quality_octopus/Aurav4.glb") : { scene: null };
  const octocasaRef = useRef();

  useEffect(() => {
    if (scene && onModelLoaded) {
      onModelLoaded(); // Notify the parent that the model is loaded
    }
  }, [scene, onModelLoaded]);

  // Don't render anything on mobile
  if (isMobile) {
    return null;
  }

  return (
    <group rotation={[0, 20, 0]}>
      <hemisphereLight intensity={1.5} groundColor="black" />
      <spotLight
        position={[-20, -100, 100]}
        angle={0}
        penumbra={1}
        intensity={0}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive
        object={scene}
        position={[-1, -1.5, 0]}
        scale={0.5}
        ref={octocasaRef}
        frustumCulled={false}
      />
    </group>
  );
};

const OctosCanvas = ({ isMuted }) => {
  // Start with null to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false); // Track if the model is loaded
  const [videoFinishedOnce, setVideoFinishedOnce] = useState(false); // Track if the video finished once
  const [videoPlaying, setVideoPlaying] = useState(false); // Track if the video is playing
  const [isLoading, setIsLoading] = useState(true); // New state for loading
  const videoRef = useRef(null);
  const cameraRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  // Mobile-specific effect: Skip model loading and keep video playing
  useEffect(() => {
    if (isMobile) {
      setModelLoaded(true); // Pretend model is loaded on mobile
      setVideoFinishedOnce(false); // Keep video playing
    }
  }, [isMobile]);

  const handleModelLoaded = () => {
    if (!isMobile) { // Only set model loaded on desktop
      setModelLoaded(true); // Mark the model as loaded
      console.log("Model loaded");
    }
  };

  const handleVideoCanPlay = () => {
    console.log("Video is ready to play");
    videoRef.current
      .play()
      .catch((error) => console.error("Video play failed:", error));
  };

  const handleVideoPlay = () => {
    setIsLoading(false); // Hide loading animation when video starts playing
    console.log("Video is playing");
  };

  const handleVideoEnded = () => {
    if (isMobile) {
      // On mobile, always loop the video
      videoRef.current.play();
      console.log("Mobile: Video looping continuously");
    } else {
      // Desktop behavior remains the same
      if (modelLoaded) {
        setVideoFinishedOnce(true); // Mark that the video has finished once
        console.log("Desktop: Video finished, model loaded");
      } else {
        // If the model is not yet loaded, restart the video
        videoRef.current.play();
        console.log("Desktop: Video looping, waiting for model to load");
      }
    }
  };

  useEffect(() => {
    if (modelLoaded && videoFinishedOnce && !isMobile) {
      console.log("Desktop: Both video finished and model loaded, showing canvas");
    }
  }, [modelLoaded, videoFinishedOnce, isMobile]);

  // Update the video sound based on isMuted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div
      id="model-section"
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Loading animation until the video starts playing OR while detecting viewport */}
      {(isLoading || isMobile === null) && (
        <div
          id="loadingScreen"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
        >
          <div className="flex flex-col items-center">
            <Player
              autoplay
              loop
              src="https://lottie.host/0c4fa9a2-8160-42dc-be11-4a6472f35d74/m1IDADzvXy.json"
              style={{ height: "300px", width: "300px" }}
            />
            <p className="text-white text-2xl mt-4">
              Loading your Aura...Please Wait!
            </p>
          </div>
        </div>
      )}

      {/* Show video until it finishes and the model is loaded (desktop) or always show on mobile */}
      {isMobile !== null && (isMobile || (!modelLoaded || !videoFinishedOnce)) && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center bg-black z-10 sm:pt-0 pt-16">
          <div className="w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              src="./AuraLogoReveal.mp4"
              autoPlay
              preload="auto"
              muted={isMuted}
              loop={isMobile} // Enable loop on mobile, disable on desktop
              className="w-full sm:h-full h-[500px] object-cover sm:object-contain"
              style={{
                objectPosition: "center 20%", // Adjust this value to change the focus point
              }}
              onCanPlay={handleVideoCanPlay} // Handle when the video can play
              onEnded={handleVideoEnded}
              onPlay={handleVideoPlay} // Video has started playing
            />
          </div>
        </div>
      )}

      {/* Render Canvas only on desktop */}
      {isMobile !== null && !isMobile && (
        <Canvas
          frameloop="always"
          shadows
          dpr={[1, 2]}
          camera={{
            position: [20, -10, 5],
            fov: 10,
            near: 0.1,
            far: 1000,
            ref: cameraRef,
          }}
          gl={{ preserveDrawingBuffer: true }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "80%",
            zIndex: modelLoaded && videoFinishedOnce ? 5 : -1, // Hide canvas until both are ready
            visibility: modelLoaded && videoFinishedOnce ? "visible" : "hidden", // Ensure it's only visible when ready
          }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              ref={controlsRef}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
            <Octos isMobile={isMobile} onModelLoaded={handleModelLoaded} />
            <Preload all />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default OctosCanvas;