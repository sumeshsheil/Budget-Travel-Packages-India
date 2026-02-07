import React from "react";
import WhatWeOfferContent from "./WhatWeOfferContent";
import Image from "next/image";
import BannerImage from "@/../public/images/heros/hero-background.png"; // Using hero-background as placeholder for now, user requested "Provide Banner Image" placeholder

const WhatWeOffer: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-box">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-inter font-bold text-black leading-tight">
            Affordable Travel Made Easy
            <br />
            With <span className="text-primary">Budget Travel Packages™</span>
          </h2>
          <p className="font-open-sans text-[#525252] text-sm md:text-base max-w-md">
            We combine smart planning, trusted partners, and personalized
            support to deliver affordable trips—No Hidden Costs.
          </p>
        </div>

        {/* Banner Image Placeholder */}
        <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-[#D9D9D9] rounded-2xl mb-16 relative overflow-hidden flex items-center justify-center">
          <span className="text-black text-xl md:text-2xl font-semibold z-10">
            Provide Banner Image
          </span>
          {/* Note: I'm commenting out the image render until a real banner is provided, 
                 using the gray placeholder as per design for "Provide Banner Image" text 
             */}
          {/* 
            <Image
                src={BannerImage}
                alt="Travel banner"
                fill
                className="object-cover opacity-50"
             /> 
             */}
        </div>

        {/* Services Grid Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-1/4">
            <h3 className="text-2xl md:text-3xl font-inter font-bold text-black mb-6">
              What We Offer
            </h3>
          </div>

          <div className="w-full lg:w-3/4">
            <WhatWeOfferContent />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
