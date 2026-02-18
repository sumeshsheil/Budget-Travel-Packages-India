"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Enquiry",
    description: "Share your travel plans with us",
    color: "bg-[#8B0000]",
  },
  {
    id: "02",
    title: "Pre-Booking",
    description: "Consultation completed and booking verified",
    color: "bg-[#8B0000]",
  },
  {
    id: "03",
    title: "Itinerary",
    description: "Receive a fully customized travel plan",
    color: "bg-[#8B0000]",
  },
  {
    id: "04",
    title: "Full Payment",
    description: "Confirm your trip and complete the payment",
    color: "bg-[#8B0000]",
  },
  {
    id: "05",
    title: "Travel",
    description: "Set off and enjoy your journey",
    color: "bg-[#8B0000]",
  },
];

const HowItWorks: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoHeight, setVideoHeight] = useState<number | undefined>(undefined);

  // Sync video container height with timeline height
  useEffect(() => {
    const updateHeight = () => {
      // Apply height sync only on large screens (xl breakpoint: 1280px)
      if (window.innerWidth >= 1280 && timelineRef.current) {
        setVideoHeight(timelineRef.current.offsetHeight);
      } else {
        setVideoHeight(undefined);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePlay();
    }
  };

  return (
    <section
      id="how-it-works"
      className="py-20 relative overflow-hidden scroll-mt-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container-box px-4">
        <header className="text-center mb-16">
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-black"
          >
            How It Works
          </h2>
          <p className="text-gray-500 mt-2">
            Our Simple Travel Planning Process
          </p>
        </header>

        <div className="flex flex-col-reverse items-center gap-y-16 xl:flex-row xl:justify-between">
          {/* Timeline */}
          <div
            ref={timelineRef}
            className="relative pl-8 md:pl-0 flex flex-col justify-center"
            role="list"
            aria-label="Travel planning steps"
          >
            {/* Line */}
            <div
              className="absolute left-[60px] h-[calc(100%-10px)] md:left-[30px] lg:left-[39px] md:h-[calc(100%-80px)] lg:h-[calc(100%-80px)] xl:h-[calc(100%-100px)] 2xl:h-[calc(100%-120px)] md:top-8 w-px bg-secondary z-0"
              aria-hidden="true"
            />

            <div className="space-y-8 relative z-10">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start"
                  role="listitem"
                  aria-label={`Step ${step.id}: ${step.title}`}
                >
                  <div
                    className={`lg:w-20 lg:h-20 w-14 bg-accent h-14 rounded-full before:content-[''] before:absolute lg:before:h-24 lg:before:w-24 before:h-20 before:w-20 before:p-6 before:bg-transparent before:border before:border-secondary before:rounded-full before:z-0 shadow-md flex items-center justify-center text-secondary font-semibold text-xl lg:text-3xl shrink-0 ${step.color} relative z-10`}
                    aria-hidden="true"
                  >
                    {step.id}
                  </div>
                  <div className="ml-6 pt-2">
                    <div className="relative mb-2 w-fit drop-shadow-md">
                      <h3
                        className="text-lg lg:text-xl text-[#3E2723] font-bold font-inter px-8 py-2 min-w-[200px] flex items-center justify-center relative z-10"
                        style={{
                          background:
                            "linear-gradient(90deg, #e3c498 0%, #cfaa7e 20%, #d6b485 24%, #cc9f6a 64%, #c9965d 100%)",
                          clipPath:
                            "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)",
                        }}
                      >
                        {/* Screw heads */}
                        <span className="absolute left-2 w-2 h-2 rounded-full bg-[#3e2723]/60 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]"></span>
                        <span className="absolute right-4 w-2 h-2 rounded-full bg-[#3e2723]/60 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.5)]"></span>
                        {step.title}
                      </h3>
                      {/* Wood texture detail lines (optional, simulated via border/gradient) */}
                    </div>
                    <p className="text-base lg:text-lg text-secondary-text font-open-sans font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Section */}
          <div
            className="relative flex items-stretch lg:justify-end justify-center"
            style={{ height: videoHeight ? `${videoHeight}px` : "auto" }}
          >
            <div className="relative h-full w-fit">
              {/* Green Shape */}
              <div
                className="absolute top-2 left-2 md:top-3 md:left-3 lg:top-4 lg:left-4 w-full h-full bg-[#34D399] rounded-[20px] -z-10 transition-all duration-300"
                aria-hidden="true"
              />

              <div
                className="relative overflow-hidden w-auto h-full group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded-[20px]"
                onClick={togglePlay}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-label={isPlaying ? "Pause video" : "Play video"}
                aria-pressed={isPlaying}
              >
                {/* Video */}
                <video
                  ref={videoRef}
                  src="/videos/helpingvideo.mp4"
                  className="w-auto h-full object-contain rounded-[20px]"
                  loop
                  playsInline
                  aria-label="How it works explainer video"
                />

                {/* Overlay - shown when video is not playing */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${
                    isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                  aria-hidden={isPlaying}
                >
                  {/* Play Button */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 group-hover:scale-110">
                    <Play
                      className="w-8 h-8 md:w-10 md:h-10 text-secondary ml-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Pause indicator - shown briefly when playing, on hover */}
                <div
                  className={`absolute inset-0 bg-black/20 transition-opacity duration-300 flex items-center justify-center ${
                    isPlaying
                      ? "opacity-0 group-hover:opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  aria-hidden="true"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Pause
                      className="w-6 h-6 md:w-8 md:h-8 text-secondary"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
