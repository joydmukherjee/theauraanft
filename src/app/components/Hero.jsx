import { motion } from "framer-motion";

import { styles } from "../styles";
import { OctosCanvas } from "./canvas";

const Hero = ({ isMuted }) => {
  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <OctosCanvas isMuted={isMuted} />
    </section>
  );
};

export default Hero;
