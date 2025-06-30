import React from "react";
import { motion } from "framer-motion";
import Tilt from 'react-parallax-tilt';
import { styles } from "../styles";
import Link from "next/link";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";
//import { Link } from "react-router-dom";
const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className="xs:w-[320px] w-[320px]"
  >
    <Tilt
      tiltMaxAngleX={45}
      tiltMaxAngleY={45}
      scale={1}
      transitionSpeed={450}
      className="bg-tertiary p-5 rounded-2xl sm:w-[310px] w-[350px]"
    >
      <div className="relative w-[310px] h-[300px]">
        <img
          src={image}
          alt="project_image"
          className="max-w-[310px] max-h-[310px] object-cover rounded-2xl"
        />
      </div>

      <div className="mt-5">
        <h3 className="text-white font-bold text-[24px]">{name}</h3>
        <p className="mt-2 text-slate-500 text-[14px]">{designation}</p>
      </div>
    </Tilt>
  </motion.div>
);

const Teams = () => {
  return (
    <div className={`mt-12 custom-background rounded-[20px]`}>
      <div
        className={`custom-background-gray rounded-2xl ${styles.padding} min-h-[350px]`}
      >
        <motion.div variants={textVariant()}>
          <h2 className={styles.sectionHeadText}>Founders Of AURA.</h2>
          <p className={`${styles.sectionSubText} text-slate-400 `}>
            Meet the team creating Eternal AURA
          </p>
          <Link href="/TeamDetails">
            <div className="">
              <button className="bg-blue-300 hover:bg-white rounded-3xl text-black px-3 py-1 mt-2">
                Learn more...
              </button>
            </div>
          </Link>
        </motion.div>
      </div>
      <div
        className={` sm:-mt-10 md:-mt-20 lg:-mt-20 xl:-mt-20 2xl:-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-8`}
      >
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Teams, "team");
