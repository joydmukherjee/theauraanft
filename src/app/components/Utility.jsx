import React from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";
import Link from "next/link";
import { styles } from "../styles";

import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt="project_image"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[22px]">{name}</h3>
          <p className="mt-2 text-slate-400 text-[12.8px]">{description}</p>
        </div>
        {tags === "3d" && (
          <Link href="/AvatarDetails">
            <div>
              <h1 className="text-white text-[14px]">
                Learn more...
              </h1>
            </div>
          </Link>
        )}
        {/* 
        {tags === "game" && (
          <div className="">
            <Link to="/game-page">
              <button>Learn more...</button>
            </Link>
          </div>
        )}
        {tags === "event" && (
          <div className="">
            <Link to="/event-page">
              <button>Learn more...</button>
            </Link>
          </div>
        )}
        {tags === "discord" && (
          <div className="">
            <Link to="/discord-page">
              <button>Learn more...</button>
            </Link>
          </div>
        )}
        {tags === "custom" && (
          <div className="">
            <Link to="/custom-page">
              <button>Learn more...</button>
            </Link>
          </div>
        )} */}
      </Tilt>
    </motion.div>
  );
};

const Utility = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText}`}>Utility.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-3 text-slate-400 text-[15px] sm:text-[15px] sm:leading-[30px] max-w-5xl "
      >
        As ardent enthusiasts and passionate fans of great artwork, we are
        committed to curating a collection that not only offers captivating and
        unique digital art pieces but also unlocks a world of utility and
        limitless possibilities for our community. We believe that NFTs should
        transcend mere collectibles, becoming versatile assets that empower
        their owners in meaningful ways.Through our carefully crafted utility
        features, we aim to revolutionize the NFT ecosystem and provide tangible
        value to our users. Let's delve into the exciting utility that awaits:
      </motion.p>
      

      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Utility, "utility");
