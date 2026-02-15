"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function WhatsAppButton() {
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    // Fetch the animation JSON from the public folder
    fetch("/lottie/whatsapp.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAnimationData(data))
      .catch((error) => {
        console.error("Failed to load WhatsApp animation:", error);
      });
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919242868839", "_blank");
  };

  if (!animationData) {
    return null; // Don't render anything until animation is loaded
  }

  return (
    <div
      onClick={handleWhatsAppClick}
      className="fixed bottom-16 right-6 z-50 cursor-pointer w-20 h-25 flex items-center justify-center hover:scale-110 transition-transform duration-300"
      role="button"
      aria-label="Contact us on WhatsApp"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleWhatsAppClick();
        }
      }}
    >
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
}
