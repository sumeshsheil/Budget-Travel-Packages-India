"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function FloatingButtons() {
  const [whatsAppAnimation, setWhatsAppAnimation] = useState<any>(null);
  const [phoneAnimation, setPhoneAnimation] = useState<any>(null);

  useEffect(() => {
    // Fetch WhatsApp animation
    fetch("/lottie/whatsapp.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setWhatsAppAnimation(data))
      .catch((err) => console.error("Failed to load WhatsApp animation:", err));

    // Fetch Phone animation
    fetch("/lottie/phone.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPhoneAnimation(data))
      .catch((err) => console.error("Failed to load Phone animation:", err));
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919242868839", "_blank");
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+919242868839";
  };

  if (!whatsAppAnimation && !phoneAnimation) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-center">
      {/* Phone Call Button
      {phoneAnimation && (
        <div
          onClick={handlePhoneClick}
          className="cursor-pointer w-20 h-20 flex items-center justify-center hover:scale-110 transition-transform duration-300"
          role="button"
          aria-label="Call us"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handlePhoneClick();
            }
          }}
        >
          <Lottie animationData={phoneAnimation} loop={true} />
        </div>
      )} */}

      {/* WhatsApp Button */}
      {whatsAppAnimation && (
        <div
          onClick={handleWhatsAppClick}
          className="cursor-pointer w-20 h-25 flex items-center justify-center hover:scale-110 transition-transform duration-300"
          role="button"
          aria-label="Contact us on WhatsApp"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleWhatsAppClick();
            }
          }}
        >
          <Lottie animationData={whatsAppAnimation} loop={true} />
        </div>
      )}
    </div>
  );
}
