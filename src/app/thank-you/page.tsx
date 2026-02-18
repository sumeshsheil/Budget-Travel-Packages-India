"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ArrowRight,
  Home,
  PhoneCall,
  Clock,
  ShieldCheck,
  Lock,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/sections/Footer";
import Button from "@/components/landing/ui/button";
import styles from "./loader.module.css";

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen flex flex-col items-center justify-center pt-38 pb-20 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/thank-you-bg.png"
            alt="Tropical coast background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Container */}
        <div className="container-box font-inter relative z-10 w-full flex flex-col items-center">
          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-6xl bg-white/60 backdrop-blur-3xl rounded-xl p-8 md:p-10 shadow-xl border border-white/20 text-center relative overflow-hidden"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                {/* Subtle Outer Glow Rings */}
                <div className="absolute inset-[-5px] bg-primary/10 rounded-full blur-lg animate-pulse" />

                <div className="relative rounded-full bg-white p-4 shadow-xl border border-primary/5">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.05, 1] }}
                    transition={{
                      delay: 0.5,
                      duration: 0.5,
                      times: [0, 0.6, 1],
                    }}
                  >
                    <CheckCircle2
                      className="w-12 h-12 text-primary/80"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Main Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                Submission <span className="text-primary">Successful!</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
                Thank you for choosing Budget Travel Packages. We&apos;ve
                received your request and our travel experts are already
                preparing local insights for you.
              </p>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {/* Card 1 */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50 flex flex-col items-center hover:transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Response Time
                </h3>
                <p className="text-gray-900 font-bold text-lg">
                  Within 24 Hours
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50 flex flex-col items-center hover:transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <PhoneCall
                    className="w-7 h-7 text-blue-600"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Support
                </h3>
                <p className="text-gray-900 font-bold text-lg">
                  24/7 Available
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50 flex flex-col items-center hover:transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className={styles.threeBody}>
                    <div className={styles.threeBodyDot} />
                    <div className={styles.threeBodyDot} />
                    <div className={styles.threeBodyDot} />
                  </div>
                </div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Status
                </h3>
                <p className="text-gray-900 font-bold text-lg">
                  Priority Processing
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/">
                <Button
                  className="bg-primary hover:bg-green-700 lg:px-16 px-8 text-white min-w-[200px] shadow-lg shadow-green-900/20 border-none"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/travel-blogs">
                <Button
                  className="bg-white/40 hover:bg-white/60 lg:px-16 px-8 text-gray-900 border border-white/60 min-w-[200px] backdrop-blur-md"
                  size="lg"
                >
                  Explore Blogs
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Badges Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8 bg-black/60 backdrop-blur-md rounded-xl p-4 md:px-8 border border-white/10 flex flex-col md:flex-row items-center gap-6 md:gap-12 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck className="w-6 h-6 text-green-400" />
              <div className="text-left leading-tight">
                <p className="text-sm font-bold tracking-wide">Verified</p>
                <p className="text-[11px] text-gray-300">Secure Submission</p>
              </div>
            </div>

            <div className="w-px h-10 bg-white/20 hidden md:block" />

            <div className="flex items-center gap-3 text-white">
              <Lock className="w-6 h-6 text-green-400" />
              <div className="text-left leading-tight">
                <p className="text-sm font-bold tracking-wide">Data Privacy</p>
                <p className="text-[11px] text-gray-300">Guaranteed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
