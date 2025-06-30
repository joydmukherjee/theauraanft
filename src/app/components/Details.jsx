import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-tilt";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";



const Details = () => {
  return (
    <div className={`mt-12 rounded-[20px]`}>
      <div
        className={`bg-black-200 rounded-2xl ${styles.padding} min-h-[80px]`}
      >
        <motion.div variants={textVariant()} className="">
          <h2 className={styles.sectionHeadText}>Welcome OCTOs.</h2>
          <p className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]">
            Learn more about these awesome OCTOs
          </p>
        </motion.div>
      </div>
      <div
        className={`bg-tertiary rounded-2xl sm:px-16 px-6 sm:py-8 py-4 min-h-[300px]`}
      >
        <motion.div
          variants={fadeIn("", "spring", 0.5, 0.75)}
          className="  w-full h-full"
        >
          <p className="mt-2 text-secondary text-[17px] max-w-5xl leading-[30px]">
            Introducing a groundbreaking NFT collection that is set to shake up
            the world of digital art and revolutionize the way we think about
            non-fungible tokens. This collection features stunningly beautiful
            designs, crafted with meticulous attention to detail and a deep
            understanding of the latest trends in art and design so that the
            owners can always feel proud of these artworks. This collection,
            built on the Solana blockchain, represents a quantum leap forward in
            the world of non-fungible tokens. The Solana blockchain is the
            perfect platform for this revolution, offering lightning-fast
            transaction speeds and unparalleled scalability.
          </p>
          <p className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]">
            Every piece in this collection is a work of art, carefully crafted
            to be both aesthetically stunning and technically groundbreaking. So
            What's more? Why is this collection any different than other
            millions of artwork out there? The answer lies in the fact that
            Unlike traditional NFT projects, this project offers an additional
            NFT to owners at no EXTRA cost at a later mint, which has the
            potential to revolutionize the NFT ecosystem. The unique aspect of
            this project is that the additional NFT is a 3D NFT, which adds a
            new level of depth and immersion to the NFT experience. This means
            that collectors will be able to view their NFTs in a
            three-dimensional space, providing a more realistic and engaging
            experience. This collection is the foundation for a new era of
            digital identity, where 3D avatars will form the basis for our
            virtual personas, our gateways to infinite new worlds. So these
            avatars can be used independently in various games including ours,
            artwoks or any other commercial business you can think of! Think
            Ready Player One! This new 3D NFT has the potential to create new
            opportunities for creators to experiment with different forms of
            media and art, and opens up new possibilities for how NFTs can be
            used in various industries. Overall, this project sets itself apart
            from others in the space by offering a new and innovative type of
            NFT that has the potential to change the game entirely, and we can
            expect to see more exciting developments in the future.
          </p>
          <p className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]">
            In addition to the 3D NFTs, this new NFT project will also
            incorporate a play-and-earn gaming ecosystem. Players can earn
            rewards and prizes by participating in games and competitions within
            the NFT ecosystem, and can even earn new NFTs by completing certain
            tasks or achievements. This will create a more engaging and
            interactive experience for collectors, as they not only own valuable
            NFTs, but also have the opportunity to earn even more rewards
            through gameplay. The addition of this gaming aspect adds a new
            level of excitement and value to the NFT ecosystem, and has the
            potential to create a new standard for NFT projects going forward.
          </p>
          <p className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]">
            Most importantly this new NFT project goes beyond just offering
            unique and innovative features, it's designed to evoke a sense of
            emotional attachment and community among its owners. At the heart of
            this project lies a deep appreciation for the artistry and
            craftsmanship that goes into creating exceptional artwork. We
            understand the profound impact that art can have on our emotions,
            thoughts, and even our sense of identity. It has the power to
            transport us to other worlds, provoke contemplation, and evoke a
            wide range of emotions. As fans ourselves, we are deeply moved by
            the ability of art to touch our souls, inspire our imagination, and
            connect us to something greater. We will strive to foster a community that
            shares this profound love for art. The play-to-earn gaming ecosystem
            creates an environment where owners can interact with each other,
            compete, and collaborate to achieve common goals. This fosters a
            sense of belonging and camaraderie, which is further enhanced by the
            3D NFTs that act as a representation of each owner's individuality
            and creativity. By owning a piece of this project, owners become
            part of a larger movement that values creativity, innovation, and
            inclusivity. They become ambassadors of a new and exciting ecosystem
            that has the potential to revolutionize the NFT space. This
            emotional connection to the project makes it more than just a
            collection of NFTs, it's a community of like-minded individuals who
            share a passion for art, gaming, and technology. This project is not
            just about the value of the NFTs, it's about the people behind them
            and the community that they create.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Details, "");
