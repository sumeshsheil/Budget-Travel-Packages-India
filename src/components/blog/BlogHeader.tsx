"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function BlogHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const navLinks = [
    { name: "All Blogs", href: "/travel-blogs" },
    { name: "Domestic", href: "/travel-blogs/category/domestic" },
    { name: "International", href: "/travel-blogs/category/international" },
    { name: "Q&A", href: "/travel-blogs/category/qa" },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container-box px-4 h-16 flex items-center justify-between gap-8">
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
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
