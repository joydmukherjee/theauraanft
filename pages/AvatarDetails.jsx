import React from "react";
import { motion } from "framer-motion";

import { styles } from "../src/app/styles";
import { SectionWrapper } from "../src/app/hoc";
import { fadeIn, textVariant } from "../src/app/utils/motion";

const AvatarDetails = () => {
  return (
    <div className={`mt-12 rounded-[20px]`}>
      <div
        className={`custom-background-gray rounded-2xl ${styles.padding} min-h-[80px]`}
      >
        <motion.div variants={textVariant()} className="">
          <h2 className={styles.sectionHeadText}>3D Avatars are here!</h2>
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
            In this rapidly evolving technological era, the emergence of
            metaverses has opened up boundless possibilities for individuals to
            explore diverse virtual realms. As people immerse themselves in
            these virtual spaces, the desire to adopt unique avatars becomes
            increasingly prevalent. It is evident that a vast array of
            metaverses will flourish in the near future, each offering its own
            distinctive experiences and communities.
          </p>
          <p className="mt-2 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            As visionary creators, we aspire to be at the forefront of this
            transformative movement. Our company aims to spearhead the
            production and provision of avatars and game assets that cater to
            the diverse needs and desires of individuals across these burgeoning
            metaverses. By harnessing the power of cutting-edge technology,
            artistic expertise, and innovative design, we strive to empower
            users to express their individuality and aspirations through their
            virtual personas.
          </p>
          <p className="mt-4 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            Our mission is to craft meticulously detailed avatars and
            captivating game assets that captivate and inspire users in these
            virtual realms. From lifelike human avatars to fantastical
            creatures, we envision a rich portfolio of customizable options that
            cater to every individual's imagination. Through seamless
            integration, our avatars will seamlessly adapt to the dynamic nature
            of metaverses, facilitating unprecedented levels of self-expression
            and immersion.
          </p>
          <p className="mt-4 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            Moreover, we recognize that inclusivity and accessibility are
            integral to the metaverse experience. Therefore, our commitment
            extends to ensuring a diverse range of avatars that reflect the
            global mosaic of identities, cultures, and perspectives. By
            embracing diversity, we seek to foster a sense of belonging and
            empowerment within the metaverse communities we serve.
          </p>
          <p className="mt-4 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            In forging the path ahead, we aspire to be pioneers in this rapidly
            expanding landscape, setting the benchmark for avatar creation and
            game asset development. By staying on the cutting edge of
            technological advancements, fostering creative collaborations, and
            listening attentively to the evolving needs of our users, we aim to
            shape the future of avatars and game assets.
          </p>
          <p className="mt-4 text-slate-400 text-[16px] max-w-5xl leading-[30px]">
            Together, let us embark on this exciting journey to bring forth a
            new era of self-expression, creativity, and connection within the
            metaverses of tomorrow. Join us as we build a company that empowers
            individuals to embrace their digital alter egos and create
            unforgettable experiences in the ever-expanding virtual frontiers.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(AvatarDetails, "");
