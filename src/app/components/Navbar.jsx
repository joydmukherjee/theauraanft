import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { styles } from "../styles";
import { navLinks } from "../constants";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaWallet, FaVolumeUp, FaVolumeMute, FaPlay, FaLock } from "react-icons/fa";
import "@solana/wallet-adapter-react-ui/styles.css";

const Navbar = ({ isMuted, onToggleSound }) => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { wallet, disconnect } = useWallet();
  const [toggleWallet, setToggleWallet] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [shakeError, setShakeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   const handleScrollToSection = (id) => {
    console.log(id);
     const section = document.getElementById(id);
     console.log(section);
     if (section) {
       window.scrollTo({
         top: section.offsetTop,
         behavior: "smooth",
       });
     }
   };

   const handlePasswordSubmit = () => {
     const passwordMap = {
       mygems: "AzukiV18.glb",
       yourauraiseternal: "Senseiv2.glb",
     };

     if (passwordMap[password.toLowerCase()]) {
       router.push({
         pathname: "/play",
         query: { model: passwordMap[password.toLowerCase()] },
       });
       setShowPasswordModal(false);
       setPassword("");
       setPasswordError("");
     } else {
       setPasswordError("Incorrect password. Please try again.");
     }
   };

  const handleConnectWallet = () => {};
  const handleDisconnectWallet = () => {
    disconnect();
  };

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" passHref>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setActive("");
              window.scrollTo(0, 0);
            }}
          >
            <img
              src="/Aura_purple.png"
              alt="logo"
              className="w-14 h-14 ml-8 -mt-2 object-contain"
            />
            {/* <p className="text-white text-[16px] -mt-2 font-bold flex">AURA</p> */}
          </div>
        </Link>

        {/* Add Sound Toggle Button in the Navbar */}
        <div className="flex gap-5 items-center">
          <button
            onClick={onToggleSound}
            className="flex items-center justify-center text-white font-semibold px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none "
          >
            {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
          </button>

          {/* <Link href="/play">
            <button className="flex items-center justify-center text-white font-semibold px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none">
              <FaPlay size={24} className="mr-2" /> Avatar
            </button>
          </Link> */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center justify-center text-white font-semibold px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            <FaPlay size={24} className="mr-2" /> Avatar
          </button>

          {/* Tailwind CSS Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" />

                <div className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-800">
                  {/* Icon Container */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900">
                      <FaLock className="text-white text-3xl" />
                    </div>
                  </div>

                  <div className="px-8 pt-16 pb-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold leading-6 text-white mb-4">
                        Enter Password
                      </h3>
                      <div className="mt-4">
                        <input
                          type="password"
                          className={`w-full px-4 py-3 bg-gray-800 border ${
                            shakeError ? "border-red-500" : "border-gray-700"
                          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all transform ${
                            shakeError
                              ? "animate-[wiggle_0.5s_ease-in-out]"
                              : ""
                          }`}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handlePasswordSubmit();
                          }}
                        />
                        {passwordError && (
                          <p
                            className={`mt-2 text-sm text-red-400 ${
                              shakeError
                                ? "animate-[wiggle_0.5s_ease-in-out]"
                                : ""
                            }`}
                          >
                            {passwordError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 px-8 py-4 flex flex-row-reverse gap-3">
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm 
                    ${
                      isLoading
                        ? "bg-blue-500 opacity-75 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    } 
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 
                    transition-all duration-200 ease-in-out transform hover:scale-105`}
                      onClick={handlePasswordSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Validating...
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-0 inline-flex justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPassword("");
                        setPasswordError("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ul className="list-none hidden md:flex flex-row gap-4">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.title ? "text-purple-500" : "text-gray-400"
                } nav-link text-[16px] skew-x-[-15deg] font-medium cursor-pointer
              ${hoveredItem === nav ? "hovered" : ""}`}
                onMouseEnter={() => handleMouseEnter(nav)}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  setActive(nav.title);
                  // handleScrollToSection(nav.id); // Scroll to the section
                  // Check if it's the Leaderboard nav item
      if (nav.title.toLowerCase() === 'leaderboard' || nav.id === 'leaderboard') {
        // Navigate to leaderboard page
        router.push('/leaderboard');
      } else {
        // Scroll to section for other nav items
        handleScrollToSection(nav.id);
      }
                }}
              >
                  {/* Remove the href for leaderboard, keep it for others */}
    {nav.title.toLowerCase() === 'leaderboard' || nav.id === 'leaderboard' ? (
      <div>
        {[...nav.title].map((letter, index) => (
          <span
            key={index}
            className={`letter ${
              hoveredItem === nav.title ? "hovered" : ""
            }`}
            style={{
              transition: "color 0.3s ease",
              transitionDelay: `${index * 0.1}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    ) : (
                <a href={`#${nav.id}`}>
                  {[...nav.title].map((letter, index) => (
                    <span
                      key={index}
                      className={`letter ${
                        hoveredItem === nav.title ? "hovered" : ""
                      }`}
                      style={{
                        transition: "color 0.3s ease",
                        transitionDelay: `${index * 0.1}s`,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </a>
                )}
              </li>
            ))}

            {/* Add icons for external links */}
            {toggleWallet === true && (
              <li className="flex items-center mt-[-12px] ">
                <a
                  href="https://twitter.com/AURAinWEB3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/twitterx.svg"
                    alt="Twitter"
                    className="w-6 h-6 object-contain navbar-icon"
                  />
                </a>
              </li>
            )}
            {toggleWallet === true && (
              <li className="flex items-center mt-[-12px] ">
                <a
                  href="https://discord.gg/sDh4kwcY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/discordIcon.svg"
                    alt="Discord"
                    className="w-6 h-6 object-contain navbar-icon"
                  />
                </a>
              </li>
            )}
            {toggleWallet === true && (
              <li className="flex items-center mt-[-12px] ">
                <a
                  href="https://www.youtube.com/@AURAinWEB3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/youtube.svg"
                    alt="Discord"
                    className="w-6 h-6 object-contain navbar-icon"
                  />
                </a>
              </li>
            )}
            {toggleWallet === true && (
              <li className="flex items-center mt-[-12px] ">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/telegram.svg"
                    alt="Discord"
                    className="w-6 h-6 object-contain navbar-icon"
                  />
                </a>
              </li>
            )}

            {toggleWallet === true && (
              <WalletMultiButton className=" mt-[-12px]" />
            )}

            {toggleWallet === false && (
              <li className="flex items-center  ">
                <a
                  href="https://twitter.com/AURAinWEB3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/twitterx.svg"
                    alt="Twitter"
                    className="w-6 h-6 object-contain navbar-icon"
                  />
                </a>
              </li>
            )}
            {toggleWallet === false && (
              <li className="flex items-center">
                <a
                  href="https://discord.gg/sDh4kwcY"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/discordIcon.svg"
                    alt="Discord"
                    className="w-6 h-6 object-contain navbar-icon"
                  />
                </a>
              </li>
            )}
            {toggleWallet === false && (
              <li className="flex items-center">
                <a
                  href="https://www.youtube.com/@AURAinWEB3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/youtube.svg"
                    alt="Discord"
                    className="w-6 h-6 object-contain navbar-icon"
                  />
                </a>
              </li>
            )}
            {toggleWallet === false && (
              <li className="flex items-center">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/telegram.svg"
                    alt="Discord"
                    className="w-6 h-6 object-contain navbar-icon"
                  />
                </a>
              </li>
            )}
          </ul>

          <div className="md:hidden flex flex-1 justify-end items-center">
            <img
              src={toggle ? "/close.svg" : "/menu.svg"}
              alt="menu"
              className="w-[28px] h-[28px] object-contain"
              onClick={() => setToggle(!toggle)}
            />

            <div
              className={`${
                !toggle ? "hidden" : "flex"
              } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
            >
              <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    className={`font-poppins font-medium cursor-pointer text-[16px] skew-x-[-15deg] nav-link ${
                      active === nav.title ? "text-purple-600" : "text-slate-400"
                    }  ${hoveredItem === nav ? "hovered" : ""}`}
                    onMouseEnter={() => handleMouseEnter(nav)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(nav.title);
                        if (nav.title.toLowerCase() === 'leaderboard' || nav.id === 'leaderboard') {
          // Navigate to leaderboard page
          router.push('/leaderboard');
        } else {
          // Scroll to section for other nav items
          handleScrollToSection(nav.id);
        }
                    }}
                  >
                     {nav.title.toLowerCase() === 'leaderboard' || nav.id === 'leaderboard' ? (
        <div>
          {[...nav.title].map((letter, index) => (
            <span
              key={index}
              className={`letter ${
                hoveredItem === nav.title ? "hovered" : ""
              }`}
              style={{
                transition: "color 0.3s ease",
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      ) : (
                    <a href={`#${nav.id}`}>
                      {" "}
                      {[...nav.title].map((letter, index) => (
                        <span
                          key={index}
                          className={`letter ${
                            hoveredItem === nav.title ? "hovered" : ""
                          }`}
                          style={{
                            transition: "color 0.3s ease",
                            transitionDelay: `${index * 0.1}s`, // Adjust the delay as needed
                          }}
                        >
                          {letter}
                        </span>
                      ))}
                    </a>
                    )}
                  </li>
                ))}
                <li className="flex items-center  ">
                  <a
                    href="https://twitter.com/AURAinWEB3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/twitterx.svg"
                      alt="Twitter"
                      className="w-6 h-6 object-contain navbar-icon"
                    />
                  </a>
                </li>
                <li className="flex items-center">
                  <a
                    href="https://discord.gg/sDh4kwcY"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/discordIcon.svg"
                      alt="Discord"
                      className="w-6 h-6 object-contain navbar-icon"
                    />
                  </a>
                </li>
                <li className="flex items-center">
                  <a
                    href="https://www.youtube.com/@AURAinWEB3"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/youtube.svg"
                      alt="Discord"
                      className="w-6 h-6 object-contain navbar-icon"
                    />
                  </a>
                </li>
                <li className="flex items-center">
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/telegram.svg"
                      alt="Discord"
                      className="w-6 h-6 object-contain navbar-icon"
                    />
                  </a>
                </li>
                {toggleWallet === true && (
                  <WalletMultiButton className=" mt-[-12px]" />
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavbarWithWalletProvider = ({ isMuted, onToggleSound }) => (
  <WalletModalProvider>
    <Navbar isMuted={isMuted} onToggleSound={onToggleSound} />
  </WalletModalProvider>
);

export default NavbarWithWalletProvider;
