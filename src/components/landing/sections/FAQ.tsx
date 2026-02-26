"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../ui/button";

import worldMap from "@/../public/images/shapes/world-map.svg";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Do you offer fixed packages or customized packages?",
    answer:
      "We offer 100% customized travel packages designed according to your budget, travel dates, and preferences.",
  },
  {
    id: 2,
    question: "Is there a pre-booking amount?",
    answer:
      "Yes, a pre-booking amount of ₹599 for domestic trips and ₹999 for international trips is required to start planning your customized itinerary.",
  },
  {
    id: 3,
    question: "Is the pre-booking amount refundable?",
    answer:
      "No, the pre-booking amount is non-refundable as it covers research, itinerary planning, and tour operator confirmations.",
  },
  {
    id: 4,
    question: "How do I pay the remaining trip amount?",
    answer:
      "The remaining trip cost can be paid in two easy installments before your travel date.",
  },
  {
    id: 5,
    question: "What is included in a customized travel package?",
    answer:
      "Your package can include flights, hotels, transfers, sightseeing, visa assistance, and activities based on your requirements.",
  },
  {
    id: 6,
    question: "Are there any hidden charges?",
    answer:
      "No. We follow transparent pricing, and all costs are clearly shared before booking confirmation.",
  },
  {
    id: 7,
    question: "Which cities do you serve?",
    answer:
      "We provide travel services across 75+ cities in India, with major bookings from Kolkata, Delhi, and Mumbai.",
  },
  {
    id: 8,
    question: "How does the booking process work?",
    answer:
      "You share your travel requirements, pay the pre-booking amount, receive a customized itinerary, and confirm your trip after finalizing the plan.",
  },
  {
    id: 9,
    question: "How long does it take to receive the itinerary?",
    answer:
      "Most customized itineraries are shared within 24–48 hours after the pre-booking payment.",
  },
  {
    id: 10,
    question: "Can I modify my itinerary after receiving it?",
    answer:
      "Yes, you can request changes until you are fully satisfied before confirming your booking.",
  },
  {
    id: 11,
    question: "Do you provide budget-friendly travel options?",
    answer:
      "Yes, we specialize in affordable travel planning without compromising on quality and comfort.",
  },
  {
    id: 12,
    question: "Do you offer international tour packages?",
    answer:
      "Yes, we provide customized international packages including visa assistance and complete travel planning.",
  },
  {
    id: 13,
    question: "Do you provide flight bookings separately?",
    answer:
      "No, we do not provide flight bookings separately.",
  },
  {
    id: 14,
    question: "Is customer support available during the trip?",
    answer:
      "Yes, our support team is available to assist you throughout your journey for a smooth travel experience.",
  },
  {
    id: 15,
    question: "Why should I choose Budget Travel Packages?",
    answer:
      "We offer personalized planning, transparent pricing, flexible payment options, and trusted service across India, making travel easy and hassle-free.",
  },
];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);
  const [visibleCount, setVisibleCount] = useState(5);
  const sectionRef = useRef<HTMLElement>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, faqData.length));
  };

  const smoothScrollTo = (targetY: number, duration = 400): Promise<void> => {
    return new Promise((resolve) => {
      const startY = window.scrollY;
      const distance = targetY - startY;

      if (Math.abs(distance) < 1) {
        resolve();
        return;
      }

      const startTime = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeInOutCubic
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(step);
    });
  };

  const handleShowLess = async () => {
    // Scroll to FAQ section top FIRST while layout is stable (all items rendered),
    // then collapse items only after the scroll animation has fully completed.
    const section = document.getElementById("faqs");
    if (section) {
      const navbarOffset = 96; // matches scroll-mt-24 (24 * 4 = 96px)
      const top =
        section.getBoundingClientRect().top + window.scrollY - navbarOffset;
      await smoothScrollTo(top);
    }
    setVisibleCount(5);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(id);
    }
  };

  // Generate JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      ref={sectionRef}
      id="faqs"
      className="py-20 lg:py-25 relative overflow-x-hidden scroll-mt-24"
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* World Map Background */}
      <div className="absolute inset-0 z-0 pointer-events-none ">
        <Image
          src={worldMap}
          alt=""
          fill
          className=" h-auto w-auto"
          aria-hidden="true"
        />
      </div>

      <div className="container-box px-4 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl lg:text-[40px] font-inter font-semibold text-secondary-text"
          >
            Frequently Asked Questions
          </h2>
        </header>

        {/* FAQ Accordion */}
        <div
          className="max-w-2xl mx-auto space-y-4"
          role="region"
          aria-label="Frequently asked questions"
        >
          {faqData.slice(0, visibleCount).map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`overflow-hidden transition-colors ${
                  isOpen ? "" : ""
                }`}
              >
                {/* Question Button */}
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  onKeyDown={(e) => handleKeyDown(e, faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={`w-full flex border  rounded-lg cursor-pointer items-center justify-between px-6 py-4 text-left state-layer font-semibold text-base md:text-lg  transition-colors ${
                    isOpen
                      ? "text-secondary-text border-primary bg-primary"
                      : "text-secondary-text border-primary"
                  }`}
                >
                  <span className="pr-4">{faq.question}</span>
                  <span
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded ${
                      isOpen ? "text-black" : "text-primary"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </span>
                </button>

                {/* Answer Panel */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 text-secondary-text text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          {visibleCount < faqData.length && (
            <Button
              onClick={handleShowMore}
              variant="outline"
              className="border-primary text-black hover:bg-primary/10 flex items-center gap-2"
            >
              Show More <ChevronDown className="w-4 h-4" />
            </Button>
          )}
          {visibleCount > 5 && (
            <Button
              onClick={handleShowLess}
              variant="outline"
              className="border-primary text-black hover:bg-primary/10 flex items-center gap-2"
            >
              Show Less <ChevronUp className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
