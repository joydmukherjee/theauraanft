import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import { useRouter } from "next/router";
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import dynamic from "next/dynamic";
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);
const Play = () => {
  const canvasRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [model, setModel] = useState(null);
  const [animationGroups, setAnimationGroups] = useState([]);
    const [spotLight, setSpotLight] = useState(null);
    const [gizmoManager, setGizmoManager] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;

    const modelFile = router.query.model || "Senseiv2.glb"; // default model if none specified
    if (canvasRef.current) {
      const engine = new BABYLON.Engine(canvasRef.current, true, {
        antialias: true,
        preserveDrawingBuffer: true,
        stencil: true,
      });
      const scene = new BABYLON.Scene(engine);
      setScene(scene);

      // Custom loading screen
      engine.loadingScreen = {
        displayLoadingUI: function () {
          const loadingScreen = document.getElementById("loadingScreen");
          if (loadingScreen) {
            loadingScreen.style.display = "flex";
          }
        },
        hideLoadingUI: function () {
          const loadingScreen = document.getElementById("loadingScreen");
          if (loadingScreen) {
            loadingScreen.style.display = "none";
            setIsLoading(false);
          }
        },
        loadingUIBackgroundColor: "rgba(0,0,0,0.8)",
      };

      // Show loading screen
      engine.displayLoadingUI();

      // Camera setup (your existing camera code)
      const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -1.57,
        1.418,
        3.0316,
        new BABYLON.Vector3(0.088, 0.989, 0.028),
        scene
      );
      camera.attachControl(canvasRef.current, true);

      // Set camera inertia (smoothness)
      camera.inertia = 0.9;

      // Set camera speed (pan/rotate speed)
      camera.speed = 0.7083;

      // Angular sensitivity for X and Y axes
      camera.angularSensibilityX = 1000; // Sensitivity for horizontal rotation
      camera.angularSensibilityY = 1000; // Sensitivity for vertical rotation

      // Wheel delta percentage for zooming with the mouse wheel
      camera.wheelDeltaPercentage = 0.01; // Zoom sensitivity for mouse wheel

      // Pinch delta percentage for touch zooming
      camera.pinchDeltaPercentage = 0.001; // Zoom sensitivity for pinch gestures

      // Control camera speed

      camera.panningSensibility = 2117.6462; // Adjust panning speed (higher value for slower pan)

      // Avoid camera clipping
      camera.minZ = 0.0354; // Adjust this value as needed to avoid near clipping (default is 1.0)
      camera.maxZ = 3541.6678; // Adjust far clipping

      camera.fov = 0.8; // Default value, adjust to see if this changes the visibility issues

      // HDRI and background setup (your existing code)
      const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        "./environment/environmentSpecular.env",
        scene
      );

      // environmentSpecular.env
      scene.environmentTexture = hdrTexture;
      scene.environmentIntensity = 0.7;
      hdrTexture.level = 1;
      //hdrTexture.rotationY = -0.8;
      hdrTexture.rotationY = -1;

      const angle = Math.PI / 4; // 45 degrees in radians
      const direction = new BABYLON.Vector3(
        -0.5006205213403575, // x-component
        -0.13471297197363907, // y-component (negative, pointing downward)
        0.8551207568495448 // z-component (negative, pointing backward)
      );
      //spotlight on the face
      const spotLight = new BABYLON.SpotLight(
        "spotLight",
        new BABYLON.Vector3(
          0.36906927824020386,
          1.8192650079727173,
          -0.49354368448257446
        ), // Position of the light
        direction, // Direction of the light
        Math.PI / 4, // Angle of the light cone
        2, // Light exponent (falloff)
        scene
      );
      spotLight.intensity = 0.25;
      setSpotLight(spotLight);

      //   const lightGizmo = new BABYLON.LightGizmo();
      //   lightGizmo.scaleRatio = 2;
      //   lightGizmo.light = spotLight;

      //   const gizmoManager = new BABYLON.GizmoManager(scene);
      //   gizmoManager.positionGizmoEnabled = true;
      //   gizmoManager.rotationGizmoEnabled = true;
      //   gizmoManager.usePointerToAttachGizmos = false;
      //   gizmoManager.attachToMesh(lightGizmo.attachedMesh);
      //   setGizmoManager(gizmoManager);

      //   // Create a cone to represent the spotlight direction
      //   const cone = BABYLON.MeshBuilder.CreateCylinder(
      //     "cone",
      //     { diameterTop: 0, diameterBottom: 1, height: 3 },
      //     scene
      //   );
      //   cone.position = spotLight.position;
      //   cone.rotation.x = Math.PI / 2; // Align cone with light direction
      //   const conematerial = new BABYLON.StandardMaterial("coneMaterial", scene);
      //   conematerial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color to represent the light
      //   conematerial.emissiveColor = new BABYLON.Color3(1, 0, 0); // Red emissive color
      //   cone.material = conematerial;
      //skybox for background
      const skyboxMaterial = new BABYLON.StandardMaterial(
        "skyBoxMaterial",
        scene
      );
      skyboxMaterial.diffuseTexture = new BABYLON.Texture(
        "./BlueBlack.jpg",
        scene
      );
      skyboxMaterial.diffuseTexture.uScale = -1; // Optional: Reverse the texture
      skyboxMaterial.backFaceCulling = false; // Ensure the texture is visible from the inside
      skyboxMaterial.disableLighting = true; // Ensure it's unaffected by light

      const skybox = BABYLON.MeshBuilder.CreateBox(
        "skyBox",
        { size: 1000.0 },
        scene
      );

      // Make sure the sphere is not affected by lights
      skybox.isPickable = false;
      skybox.infiniteDistance = true;
      skybox.material = skyboxMaterial;
      skybox.renderingGroupId = 0; // Make sure it's rendered behind everything else

      //const backgroundTexture = "./backgroundBlur.png";
      //   // const backgroundTexture = "./BlackPatterns.jpg";
      //   const backgroundTexture = "./BlueBlack.jpg";
      //       // const backgroundTexture = "./BlueGradient.jpg";
      //        //const backgroundTexture = "./Blue.png";
      //         //const backgroundTexture = "./BlueDesign.jpg";
      //          //const backgroundTexture = "./RedDesign.jpg";
      //         // const backgroundTexture = "./BluePink.jpg";
      //          // const backgroundTexture = "./RedG.jpg";
      //     //   //const backgroundTexture = "./Red.png";
      //     //   // const backgroundTexture = "./Grey.webp";

      // const backgroundLayer = new BABYLON.Layer(
      //   "backgroundLayer",
      //   backgroundTexture,
      //   scene
      // );
      // backgroundLayer.isBackground = true;
      // backgroundLayer.texture.level = 0;

      // Load the 3D model
      BABYLON.SceneLoader.ImportMesh(
        "",
        "./high_quality_octopus/",
        modelFile,
        //"Senseiv2.glb",
        //"AzukiV18.glb",
        scene,
        (meshes, particleSystems, skeletons, animationGroups) => {
          const model = meshes[0];
          console.log(meshes);

          setModel(model);
          setAnimationGroups(animationGroups);
          
          const headMesh = meshes[8];

          meshes.forEach((mesh) => {
            mesh.refreshBoundingInfo(true);
            mesh.alwaysSelectAsActiveMesh = true;
            mesh.isVisible = true;
          });

          // Enable shadows for the model
          meshes.forEach((mesh) => {
            mesh.receiveShadows = true;
            mesh.castShadows = true;
          });

          // Hide loading screen when model is loaded
          engine.hideLoadingUI();

          //   // Add Glow Layer to the scene
          //   const glowLayer = new BABYLON.GlowLayer("glow", scene);

          //   // Set the intensity of the glow
          //   glowLayer.intensity = 0.001; // Adjust the glow intensity (default is 1)

          //   // Add glow to specific meshes (optional)
          //   headMesh.material.emissiveColor = new BABYLON.Color3(1, 0.8, 0.9); // Add emissive color to make the head glow
          if (modelFile === "AzukiV18.glb"){
            animationGroups[0].stop();
            animationGroups[1].play();
          } else if (modelFile === "Senseiv2.glb"){
            animationGroups[0].stop();
            animationGroups[2].play();
            
          }

          model.scaling = new BABYLON.Vector3(-1, 1, 1);
          model.position = new BABYLON.Vector3(0, 0, 0);

          // Create 3D buttons
          createModernAnimationButtons(scene, animationGroups,modelFile);

          //  Add post-processing effects
          addPostProcessing(scene, camera);
        }
      );

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });

      return () => {
        scene.dispose();
        engine.dispose();
      };
    }
  }, [router.isReady, router.query.model]);

  const captureLightPosition = () => {
    if (spotLight && gizmoManager) {
      const lightPosition = spotLight.position;
      const lightDirection = spotLight.direction;

      console.log("Light Position:", lightPosition);
      console.log("Light Direction:", lightDirection);

      // You can now use these values to update your code
      // For example, update the initial spotlight creation:
      /*
      const spotLight = new BABYLON.SpotLight(
        "spotLight",
        new BABYLON.Vector3(${lightPosition.x}, ${lightPosition.y}, ${lightPosition.z}),
        new BABYLON.Vector3(${lightDirection.x}, ${lightDirection.y}, ${lightDirection.z}),
        Math.PI / 3,
        2,
        scene
      );
      */
    }
  };

   const addPostProcessing = (scene, camera) => {
     // Bloom
     const bloomPipeline = new BABYLON.DefaultRenderingPipeline(
       "bloom",
       true,
       scene,
       [camera]
     );
     bloomPipeline.bloomEnabled = true;
     bloomPipeline.bloomThreshold = 0.05;
     bloomPipeline.bloomWeight = 0.1;
     bloomPipeline.bloomKernel = 90;
     bloomPipeline.bloomScale = 0.1;
     //bloomPipeline.depthOfFieldEnabled = true;
     bloomPipeline.fxaaEnabled = true;

     // Enable ACES tone mapping
     pipeline.imageProcessing.toneMappingEnabled = true;
     pipeline.imageProcessing.toneMappingType =
       BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;

     // Adjust exposure for tone mapping
     pipeline.imageProcessing.exposure = 1.0; // Set exposure to control brightness

    //  // Add SSAO (as a SSGI approximation)
    //  const ssao = new BABYLON.SSAORenderingPipeline(
    //    "ssao",
    //    scene,
    //    {
    //      ssaoRatio: 0.5, // The SSAO ratio
    //      combineRatio: 1.0, // The combining ratio
    //    },
    //    [camera]
    //  );

    //  // Customize SSAO parameters
    //  ssao.fallOff = 0.000001;
    //  ssao.area = 0.0075;
    //  ssao.radius = 0.0001;
    //  ssao.totalStrength = 0.9;
    //  ssao.base = 0.5;

    //  // Attach SSAO to the pipeline
    //  scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
    //    "ssao",
    //    camera
    //  );

     // Shadows
     const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
     shadowGenerator.useBlurExponentialShadowMap = true;
     shadowGenerator.blurKernel = 32;
   };

  const createModernAnimationButtons = (scene, animationGroups, modelFile) => {
    if(modelFile === "AzukiV18.glb"){
       const buttonData = [
         { name: "Idle", index: 1, color: "#000000" },
         { name: "Walk", index: 0, color: "#000000" },
         { name: "Run", index: 3, color: "#000000" },
         { name: "Dance", index: 4, color: "#000000" },
       ];

       const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
         "UI",
         true,
         scene
       );

       buttonData.forEach((button, idx) => {
         const btn = GUI.Button.CreateSimpleButton(`button${idx}`, button.name);
         btn.width = "120px";
         btn.height = "40px";
         btn.color = "#FFD43C";
         btn.cornerRadius = 20;
         btn.background = button.color;
         btn.fontSize = 14;
         btn.fontFamily = "Arial, sans-serif";
         btn.shadowColor = "black";
         btn.shadowBlur = 5;
         btn.shadowOffsetX = 2;
         btn.shadowOffsetY = 2;

         // Position buttons at the top left corner
         btn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
         btn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
         btn.left = "20px"; // Distance from the left edge
         btn.top = `${20 + idx * 50}px`; // Distance from the top edge, stacked vertically

         // Hover effect
         btn.pointerEnterAnimation = () => {
           btn.background = BABYLON.Color3.FromHexString(button.color)
             .add(new BABYLON.Color3(0.1, 0.1, 0.1))
             .toHexString();
           btn.scaleX = 1.05;
           btn.scaleY = 1.05;
         };

         btn.pointerOutAnimation = () => {
           btn.background = button.color;
           btn.scaleX = 1;
           btn.scaleY = 1;
         };

         btn.onPointerUpObservable.add(() => {
           animationGroups.forEach((ag) => ag.stop());
           animationGroups[button.index].play(true);
         });

         advancedTexture.addControl(btn);
       });
    }else if (modelFile === "Senseiv2.glb") {
        const buttonData = [
          { name: "Breathe In, Breathe Out", index: 2, color: "#000000" },
          { name: "Walk", index: 1, color: "#000000" },
          { name: "Namaste", index: 3, color: "#000000" },
          
        ];

        const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
          "UI",
          true,
          scene
        );

        buttonData.forEach((button, idx) => {
          const btn = GUI.Button.CreateSimpleButton(
            `button${idx}`,
            button.name
          );
          btn.width = "120px";
          btn.height = "40px";
          btn.color = "#FFD43C";
          btn.cornerRadius = 20;
          btn.background = button.color;
          btn.fontSize = 14;
          btn.fontFamily = "Arial, sans-serif";
          btn.shadowColor = "black";
          btn.shadowBlur = 5;
          btn.shadowOffsetX = 2;
          btn.shadowOffsetY = 2;

          // Position buttons at the top left corner
          btn.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          btn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
          btn.left = "20px"; // Distance from the left edge
          btn.top = `${20 + idx * 50}px`; // Distance from the top edge, stacked vertically

          // Hover effect
          btn.pointerEnterAnimation = () => {
            btn.background = BABYLON.Color3.FromHexString(button.color)
              .add(new BABYLON.Color3(0.1, 0.1, 0.1))
              .toHexString();
            btn.scaleX = 1.05;
            btn.scaleY = 1.05;
          };

          btn.pointerOutAnimation = () => {
            btn.background = button.color;
            btn.scaleX = 1;
            btn.scaleY = 1;
          };

          btn.onPointerUpObservable.add(() => {
            animationGroups.forEach((ag) => ag.stop());
            animationGroups[button.index].play(true);
          });

          advancedTexture.addControl(btn);
        });
    }
   
  };

  return (
    <div className="h-full w-full flex flex-col">
      <canvas ref={canvasRef} className="flex-grow" />
      {/* <button
        onClick={captureLightPosition}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Capture Light Position
      </button> */}
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
          <p className="text-white text-2xl mt-4">Loading your Aura...Please Wait!</p>
        </div>
      </div>
    </div>
  );
};

export default Play;
