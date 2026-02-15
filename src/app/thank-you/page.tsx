"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ArrowRight,
  Home,
  Calendar,
  PhoneCall,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/sections/Footer";
import Button from "@/components/landing/ui/button";

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2642&auto=format&fit=crop"
            alt="Travel background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content Container */}
        <div className="container-box relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 text-center"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative rounded-full bg-primary/10 p-6 flex items-center justify-center border border-primary/20">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                </div>
              </div>
            </motion.div>

            {/* Main Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold font-inter text-gray-900 tracking-tight">
                Submission{" "}
                <span className="text-primary italic">Successful!</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 font-open-sans max-w-xl mx-auto leading-relaxed">
                Thank you for choosing{" "}
                <span className="font-bold text-gray-800">
                  Budget Travel Packages
                </span>
                . We've received your request and our travel experts are already
                preparing local insights for you.
              </p>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 mb-10"
            >
              <div className="bg-white/50 p-4 rounded-2xl border border-gray-100/50 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Response Time
                </h3>
                <p className="text-gray-800 font-bold">Within 24 Hours</p>
              </div>

              <div className="bg-white/50 p-4 rounded-2xl border border-gray-100/50 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <PhoneCall className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Support
                </h3>
                <p className="text-gray-800 font-bold">24/7 Available</p>
              </div>

              <div className="bg-white/50 p-4 rounded-2xl border border-gray-100/50 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Status
                </h3>
                <p className="text-gray-800 font-bold">Priority Processing</p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-gray-100 pt-10"
            >
              <Link href="/">
                <Button
                  variant="primary"
                  size="lg"
                  className="group min-w-[200px]"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/travel-blogs">
                <Button
                  variant="outline"
                  size="lg"
                  className="group min-w-[200px]"
                >
                  Explore Blogs
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Verification Badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2 }}
            className="text-center text-white text-xs mt-8 flex items-center justify-center gap-2"
          >
            🛡 Verified Secure Submission & Data Privacy Guaranteed
          </motion.p>
        </div>
      </main>
      <Footer />
    </>
  );
}
