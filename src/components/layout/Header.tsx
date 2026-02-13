"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/../public/images/logo/logo.svg";
import Link from "next/link";
import MenuIcon from "../icons/Menu";
import { motion, AnimatePresence } from "motion/react";
import LanguageSelector from "./LanguageSelector";

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
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.07, ease: "easeIn" }}
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-3 shadow-lg border-b border-white/10"
            : "py-5 bg-linear-to-b from-black/50 to-transparent"
        }`}
      >
        <div className="container-box flex items-center justify-between relative">
          <div className="relative z-50">
            <Link href="/" aria-label="Home">
              <Image
                src={logo}
                alt="Budget Travel Packages Logo"
                width={240}
                height={102}
                priority
                className="w-32 sm:w-40 md:w-48 lg:w-60 h-auto transition-all duration-300"
              />
            </Link>
          </div>
          <nav
            aria-label="Social Media"
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 hidden sm:block"
          >
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Image
                  src="/images/footer/social/instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6 transition-all"
                />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <Image
                  src="/images/footer/social/facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6 transition-all"
                />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                aria-label="Subscribe to our YouTube channel"
              >
                <Image
                  src="/images/footer/social/youtube.svg"
                  alt="YouTube"
                  width={24}
                  height={24}
                  className="w-5 h-5 md:w-6 md:h-6 transition-all"
                />
              </Link>
            </div>
          </nav>
          <div>
            <div className="flex items-center gap-4 h-8">
              <LanguageSelector />
              <div className="bg-white h-full w-px mx-2"></div>
              <motion.button
                ref={buttonRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={toggleMenu}
                className="focus:outline-none cursor-pointer"
                aria-label="Toggle Menu"
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
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="absolute right-4 top-16 md:top-20 mt-6 bg-white rounded-2xl shadow-xl overflow-hidden z-50 w-60 origin-top-right border border-gray-100"
            >
              <div className="p-6 flex flex-col gap-6">
                <ul className="flex flex-col gap-4">
                  {[
                    { href: "/services", label: "Services" },
                    { href: "/travel-purpose", label: "Travel Purpose" },
                    { href: "/customize-trip", label: "Customize Trip" },
                    { href: "/how-it-works", label: "How It Works" },
                    { href: "/faqs", label: "FAQs" },
                    { href: "/contact", label: "Contact" },
                    { href: "/about", label: "About" },
                  ].map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        className="block text-secondary-text hover:text-primary transition-colors font-semibold text-sm md:text-lg font-open-sans"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile Social Icons */}
                <div className="sm:hidden pt-4 border-t border-gray-100 flex flex-col items-center">
                  <p className="text-secondary-text text-sm font-semibold mb-3">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-6">
                    <Link
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform"
                    >
                      <Image
                        src="/images/footer/social/instagram.svg"
                        alt="Instagram"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </Link>
                    <Link
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform"
                    >
                      <Image
                        src="/images/footer/social/facebook.svg"
                        alt="Facebook"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </Link>
                    <Link
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-transform"
                    >
                      <Image
                        src="/images/footer/social/youtube.svg"
                        alt="YouTube"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
