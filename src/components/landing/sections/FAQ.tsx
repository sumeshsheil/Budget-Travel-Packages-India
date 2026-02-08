"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

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
    question: "Q1. Do you offer customized tour packages?",
    answer:
      "Yes, all our trips can be customized based on your budget and preferences.",
  },
  {
    id: 2,
    question: "Q2. Are your prices budget-friendly?",
    answer:
      "Absolutely! We specialize in providing high-value travel experiences at competitive prices, ensuring you get the best value for your money.",
  },
  {
    id: 3,
    question: "Q3. Do you help with visa and insurance?",
    answer:
      "Yes, we provide complete visa assistance and travel insurance options to ensure a hassle-free travel experience.",
  },
  {
    id: 4,
    question: "Q4. Is customer support available during travel?",
    answer:
      "Yes, our dedicated support team is available 24/7 during your travel to assist you with any queries or emergencies.",
  },
];

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(id);
    }
  };

  return (
    <section
      className="py-20 relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* World Map Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <Image
          src={worldMap}
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden="true"
        />
      </div>

      {/* Decorative Plant - Left Side */}
      <div className="absolute bottom-0 left-0 z-10 pointer-events-none">
        <Image
          src={plant}
          alt=""
          width={120}
          height={200}
          className="w-20 md:w-28 lg:w-32 h-auto"
          aria-hidden="true"
        />
      </div>

      <div className="container-box px-4 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-inter font-bold text-black"
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
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  isOpen
                    ? "border-primary bg-primary"
                    : "border-gray-300 bg-white"
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
                  className={`w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-base md:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 transition-colors ${
                    isOpen
                      ? "text-secondary-text"
                      : "text-secondary-text hover:bg-gray-50"
                  }`}
                >
                  <span className="pr-4">{faq.question}</span>
                  <span
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded ${
                      isOpen ? "bg-secondary text-white" : "bg-gray-100"
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
                      <div className="px-6 pb-4 text-secondary-text text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
