"use client";
import Image from "next/image";
import React from "react";
import logo from "@/../public/images/logo/logo.svg";
import Link from "next/link";
import FacebookIcon from "../icons/Facebook";
import XIcon from "../icons/X";
import InstagramIcon from "../icons/Instagram";
import YoutubeIcon from "../icons/Youtube";
import MenuIcon from "../icons/Menu";
import { motion, AnimatePresence } from "motion/react";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full fixed top-0 left-0 z-50 pt-7"
      >
        <div className="container-box flex items-center justify-between">
          <div className="relative">
            <Link href="/">
              <Image src={logo} alt="Logo" width={172} height={73} priority />
            </Link>
          </div>
          <div>
            <nav>
              <ul className="flex items-center gap-2">
                <li>
                  <Link href={"/"}>
                    <motion.div
                      whileHover={{ scale: 1.1, backgroundColor: "#01FF70" }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="h-6.5 w-6.5 rounded-full bg-secondary flex items-center justify-center transition-colors group"
                    >
                      <FacebookIcon className="group-hover:text-black text-white transition-colors" />
                    </motion.div>
                  </Link>
                </li>
                <li>
                  <Link href={"/"}>
                    <motion.div
                      whileHover={{ scale: 1.1, backgroundColor: "#01FF70" }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="h-6.5 w-6.5 rounded-full bg-secondary flex items-center justify-center transition-colors group"
                    >
                      <XIcon className="group-hover:text-black text-white transition-colors" />
                    </motion.div>
                  </Link>
                </li>
                <li>
                  <Link href={"/"}>
                    <motion.div
                      whileHover={{ scale: 1.1, backgroundColor: "#01FF70" }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="h-6.5 w-6.5 rounded-full bg-secondary flex items-center justify-center transition-colors group"
                    >
                      <YoutubeIcon className="group-hover:text-black text-white transition-colors" />
                    </motion.div>
                  </Link>
                </li>
                <li>
                  <Link href={"/"}>
                    <motion.div
                      whileHover={{ scale: 1.1, backgroundColor: "#01FF70" }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="h-6.5 w-6.5 rounded-full bg-secondary flex items-center justify-center transition-colors group"
                    >
                      <InstagramIcon className="group-hover:text-black text-white transition-colors" />
                    </motion.div>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <div className="flex items-center gap-4 h-8">
              <div className="bg-white h-full w-px mx-2"></div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={toggleMenu}
                className="focus:outline-none cursor-pointer"
              >
                <MenuIcon className="text-[#01FF70]" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center"
          >
            <div className="absolute top-7 right-7">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="text-white p-2"
              >
                Close
              </motion.button>
            </div>
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Menu</h2>
              <ul className="space-y-4 text-xl">
                <li>
                  <Link
                    href="/"
                    onClick={toggleMenu}
                    className="hover:text-[#01FF70] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={toggleMenu}
                    className="hover:text-[#01FF70] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tours"
                    onClick={toggleMenu}
                    className="hover:text-[#01FF70] transition-colors"
                  >
                    Tours
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    onClick={toggleMenu}
                    className="hover:text-[#01FF70] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
              <p className="mt-8 text-gray-400">Random text as requested...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
