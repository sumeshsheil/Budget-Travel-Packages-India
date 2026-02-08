"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/../public/images/logo/logo.svg";
import Link from "next/link";
import MenuIcon from "../icons/Menu";
import { motion, AnimatePresence } from "motion/react";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-md py-4 shadow-lg"
            : "pt-7 bg-transparent"
        }`}
      >
        <div className="container-box flex items-center justify-between">
          <div className="relative">
            <Link href="/">
              <Image src={logo} alt="Logo" width={172} height={73} priority />
            </Link>
          </div>
          <div>
            <nav>
              <div className="flex items-center gap-3 text-white font-bold text-sm md:text-base lg:text-lg font-open-sans">
                <Link
                  href="/"
                  className="hover:text-[#01FF70] transition-colors"
                >
                  Kolkata
                </Link>
                <span>|</span>
                <Link
                  href="/"
                  className="hover:text-[#01FF70] transition-colors"
                >
                  Delhi
                </Link>
                <span>|</span>
                <Link
                  href="/"
                  className="hover:text-[#01FF70] transition-colors"
                >
                  Mumbai
                </Link>
              </div>
            </nav>
          </div>
          <div>
            <div className="flex items-center gap-4 h-8">
              <div className="bg-white h-full w-px mx-2"></div>
              <motion.button
                ref={buttonRef}
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

        {/* Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-4 md:right-8 lg:right-40 mt-2 w-64 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="p-6">
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/"
                      onClick={toggleMenu}
                      className="block text-white hover:text-[#01FF70] transition-colors font-medium text-lg"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      onClick={toggleMenu}
                      className="block text-white hover:text-[#01FF70] transition-colors font-medium text-lg"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tours"
                      onClick={toggleMenu}
                      className="block text-white hover:text-[#01FF70] transition-colors font-medium text-lg"
                    >
                      Tours
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      onClick={toggleMenu}
                      className="block text-white hover:text-[#01FF70] transition-colors font-medium text-lg"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
