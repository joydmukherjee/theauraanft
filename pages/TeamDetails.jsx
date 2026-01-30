import React from "react";
import { motion } from "framer-motion";

import { styles } from "../src/app/styles";
import { SectionWrapper } from "../src/app/hoc";
import { fadeIn, textVariant } from "../src/app/utils/motion";

const TeamDetails = () => {
  return (
    <div className={`mt-12 rounded-[20px]`}>
      <div
        className={`custom-background-gray rounded-2xl ${styles.padding} min-h-[80px]`}
      >
        <motion.div variants={textVariant()} className="">
          <h2 className={styles.sectionHeadText}>Founders of AURA.</h2>
        </motion.div>
      </div>
      <div
        className={`custom-background rounded-2xl sm:px-16 px-6 sm:py-8 py-4 min-h-[300px]`}
      >
        <motion.div
          variants={fadeIn("", "spring", 0.5, 0.75)}
          className="  w-full h-full"
        >
          <p className="mt-2 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            This project is created by three friends who come from different
            professional backgrounds but share a passion for web3 and gaming.
          </p>
          <p className="mt-2 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            Infinix is a Marine engineer & currently a self-taught programmer with 10 years of experience , Golden Sparrow
            is a skilled designer with 8 years worth of experience, while
            Celeste who is a management consultant is the heart and soul of this
            team working as a Top Manager in a Accountancy firm. We as a team have a vision of creating something that could
            bridge our different fields and be rewarding for us personally,
            while also making a positive impact on the wider community. Our
            combined skills and expertise led us to create this NFT project that
            incorporates our shared interests in art, technology, and gaming.
          </p>
          <p className="mt-4 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            The passion that we have for this project is evident in every aspect of it. From the addictive Fun-To-Play mechanics and immersive lore centered on 'BREAK THE CODE' unlocking inner power, breaking limits, and awakening potential, it's clear that we have poured our hearts and souls into creating something we believe in. We want to become the go-to brand for building industry-level, high-quality action RPG on Solana, where gameplay comes first and NFTs form the passionate community backbone. We are committed to building a community around this project, one that is inclusive, supportive, and inspiring. We want to share our passion with others and create a movement that values creativity, collaboration, and fun.


          </p>
          <p className="mt-4 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            By owning a piece of this project, owners become part of the journey
            that we guys have embarked on. We are supporting a project that is
            born out of passion and a desire to create something meaningful.
            This emotional connection to the project makes it more than just a
            collection of NFTs , it's a community of
            like-minded individuals who share a common vision and a sense of
            purpose.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(TeamDetails, "");