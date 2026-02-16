"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import Button from "../ui/button";

import worldMap from "@/../public/images/shapes/world-map.svg";
import plant from "@/../public/images/shapes/plant.svg";

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
    question: "Do you provide flight and hotel bookings separately?",
    answer:
      "Yes, we can arrange flights, hotels, or both as part of your customized travel plan.",
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

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, faqData.length));
  };

  const handleShowLess = () => {
    setVisibleCount(5);
    // Optionally scroll back to top of FAQs if user collapses a long list
    const faqHeading = document.getElementById("faq-heading");
    if (faqHeading) {
      faqHeading.scrollIntoView({ behavior: "smooth" });
    }
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
        <div className="flex justify-center mt-10">
          {visibleCount < faqData.length ? (
            <Button
              onClick={handleShowMore}
              variant="outline"
              className="border-primary text-black hover:bg-primary/10 flex items-center gap-2"
            >
              Show More <ChevronDown className="w-4 h-4" />
            </Button>
          ) : (
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
