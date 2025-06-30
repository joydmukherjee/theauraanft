import React from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap justify-center gap-10">
        {technologies.map((technology) => (
          <div className="w-150 h-150 " key={technology.name}>
            <BallCanvas 
              name={technology.name}
              url={technology.url}
              localUrl={technology.localUrl}
            />
          </div>
        ))}
      </div>
      <p className="mt-20 text-white ">
        Made with <span style={{ color: "red" }}>{"\u2764"}</span> in
        Infiniverse Labs
      </p>
    </div>
  );
};

export default SectionWrapper(Tech, "");
