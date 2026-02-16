"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BlogHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Adventure", href: "#" },
    { name: "Budget Tips", href: "#" },
    { name: "Destinations", href: "#" },
    { name: "Food & Drink", href: "#" },
    { name: "Travel Guides", href: "#" },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container-box px-4 h-20 flex items-center justify-between gap-8">
        {/* Search Bar */}
        <div className="relative w-full max-w-sm hidden md:block">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700"
          />
        </div>

        {/* Mobile Search Icon (visible only on small screens) */}
        <button className="md:hidden p-2 text-gray-600">
          <Search className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button (Placeholder) */}
        {/* <button className="md:hidden">...</button> */}
      </div>
    </header>
  );
}
