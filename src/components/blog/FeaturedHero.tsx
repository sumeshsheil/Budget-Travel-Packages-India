"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface FeaturedHeroProps {
  post: {
    title: string;
    description: string;
    author: string;
    date: string;
    category: string;
    image: string;
  };
}

export default function FeaturedHero({ post }: FeaturedHeroProps) {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-box px-4 relative z-10 w-full">
        <div className="max-w-2xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block mb-4 text-xs font-bold tracking-wider uppercase">
              Featured Post
            </span>
            <div className="mb-4">
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed">
              {post.description}
            </p>

            <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
              <span>By {post.author}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>{post.date}</span>
            </div>

            {/* Decorative Diamond Icon matching the design */}
            <div className="absolute right-0 bottom-0 md:relative md:mt-12 md:flex md:justify-center md:right-auto hidden">
              <div className="w-10 h-10 border-2 border-white/30 rotate-45 flex items-center justify-center">
                <div className="w-6 h-6 border border-white/50 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
