import React from "react";
import Marquee from "../ui/Marquee";
import HeroContent from "./HeroContent";
import HeroBackground from "./HeroBackground";

const Hero: React.FC = () => {
  return (
    <section className="min-h-dvh h-full w-full relative isolate overflow-hidden">
      {/* Overlay */}
      <div
        className="hero-section-bg-overlay-gradient z-1 pointer-events-none"
        aria-hidden="true"
      />

      {/* Background Media */}
      <HeroBackground />

      {/* Content */}
      <div className="container-box max-w-max w-full mx-auto relative z-2 text-center h-full flex flex-col justify-center items-center pt-0 pb-20 lg:pt-0 min-h-dvh">
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
