import Image from "next/image";
import React from "react";
import HeroBg from "@/../public/images/heros/hero-background.png";
import Marquee from "../ui/Marquee";
import HeroContent from "./HeroContent";

const Hero: React.FC = () => {
  return (
    <section className="min-h-dvh h-full w-full relative isolate overflow-hidden">
      {/* Overlay */}
      <div
        className="hero-section-bg-overlay-gradient z-1 pointer-events-none"
        aria-hidden="true"
      />
      {/* Background Image */}
      <div className="absolute h-[calc(100dvh-54px)] w-full z-0">
        <Image
          src={HeroBg}
          alt="Scenic travel destination background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      {/* Content */}
      <div className="container-box max-w-[830px] w-full mx-auto relative z-2 text-center h-full flex flex-col justify-center items-center pt-32 pb-20 lg:pt-0 min-h-dvh">
        <HeroContent />
      </div>
      {/* Infinity Red Carousel */}
      <div className="absolute bottom-0 left-0 right-0 z-3">
        <Marquee />
      </div>
    </section>
  );
};

export default Hero;
