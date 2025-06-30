import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
  useGLTF,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

const RotatingModel = ({url,localUrl}) => {
  console.log(url, localUrl);
  const modelRef = useRef();
  
  const { scene } = useGLTF(localUrl);
 
  
  // Use the useFrame hook to update the rotation on each frame
   useFrame(({ clock }) => {
    
     // Update the rotation on each frame
    //  if (modelRef.current) {
    //    modelRef.current.rotation.y = clock.getElapsedTime() * 1; // Adjust the rotation speed as needed
    //  }
   });

   const handleClick = () => {
     // Open a new window with the desired URL
     window.open(url, "_blank");
   };

  return (
    <mesh onClick={handleClick}>
      {
        /* Add your 3D model here */
        <primitive
          object={scene}
          scale={0.0125}
          ref={modelRef}
          rotation={[0, 0, 0]}
        />
      }
    </mesh>
  );
};

const BallCanvas = ({name,url,localUrl}) => {
  //console.log(name, url, localUrl);
  return (
    <Canvas className="cursor-pointer"
      frameloop="always"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <ambientLight />
        <hemisphereLight intensity={1} groundColor="black" />
        <pointLight position={[10, 10, 10]} />
        <RotatingModel url={url} localUrl={localUrl} />
      </Suspense>
      {/* <Preload all /> */}
    </Canvas>
  );
};



export default BallCanvas;
