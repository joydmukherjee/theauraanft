import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-tilt";
import { styles } from "../src/app/styles";
import { SectionWrapper } from "../src/app/hoc";
import { fadeIn, textVariant } from "../src/app/utils/motion";

const Details = () => {
  return (
    <div className={`mt-12 rounded-[20px] `}>
      <div
        className={`custom-background-gray rounded-2xl ${styles.padding} min-h-[80px]`}
      >
      <motion.div className="relative w-fit mx-auto">
  {/* white background box */}
  <div className="absolute z-0 skew-x-[-12deg] px-32 py-8 bg-white shadow-lg rounded-md" >
     <div className="invisible">Placeholder</div>
  </div>

  {/* purple foreground box */}
  <div className="relative top-[-10px] left-[-14px] z-10 skew-x-[-12deg] px-16 py-6 bg-black shadow-2xl rounded-md">
    <h2 className="text-white text-3xl font-bold skew-x-[12deg] px-4">WELCOME AURA FAM</h2>
  </div>
</motion.div>
      </div>
      <div
        className={`custom-background rounded-2xl sm:px-16 px-6 sm:py-8 py-4 min-h-[300px] `}
      >
        <motion.div
          variants={fadeIn("", "spring", 0.5, 0.75)}
          className="  w-full "
        >
          <div className="max-w-5xl sm:max-w-2xl leading-[30px]">
            <p className="mt-4 text-white text-[17px] long-text long-big-text ">
              “Everyone is born with an Aura : A dormant power waiting to awaken.”

            </p>
            <p className="mt-4 text-white text-[17px] long-text long-big-text ">
              In the world of Aura, powers lie hidden beneath the surface of everyday life. For most, it remains just a whisper. But for a chosen few, that inner force awakens , unlocking abilities that defy reason and rewrite fate.
            </p>
            <p className="mt-4 text-white text-[17px] long-text long-big-text">
              Aura was born out of our love for comics, art, and storytelling , but it became something much more. We created this epic saga not just to tell a story, but to feel one. To build a universe that captures imaginations, breaks hearts, and lifts spirits and that too in the same breath.
            </p>
            <p className="mt-4 text-white text-[17px] long-text long-big-text">
              But behind all the action, drama, and powers, lies our true mission:
To create a HOME.
</p>
            <p>
              A community that feels like FAMILY where victories are shared, losses are understood, and every member matters.

            </p>
            <p>
              Where people don’t just “follow” but they belong.

            </p>
            <p>
              Where you can rely on us like your morning coffee - warm, dependable, and impossible to start your day without.
            </p>
            <p className="mt-4 text-white text-[17px] long-text long-big-text">
              This is Aura.
            </p>
            <p>
              Not just a story. Not just a project.
            </p>
            <p>
              It’s a feeling.
            </p>
            <p>
              And it’s yours.
            </p>
            <p className="mt-4 text-white text-[17px] long-text long-big-text">
             BREAK THE CODE

            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Details, "");
