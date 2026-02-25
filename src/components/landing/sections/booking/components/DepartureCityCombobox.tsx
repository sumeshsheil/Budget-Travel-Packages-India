"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { setDepartureCity } from "@/lib/redux/features/bookingSlice";
import { labelClass, getInputClass, errorTextClass } from "../styles";

// List of departure cities
const DEPARTURE_CITIES = [
  "Agartala",
  "Ahmedabad",
  "Aizawl",
  "Ajmer",
  "Amritsar",
  "Asansol",
  "Aurangabad",
  "Bagdogra",
  "Belagavi",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Bilaspur",
  "Bokaro",
  "Calicut",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Dibrugarh",
  "Dimapur",
  "Durgapur",
  "Erode",
  "Gaya",
  "Guwahati",
  "Hubballi",
  "Hyderabad",
  "Imphal",
  "Indore",
  "Itanagar",
  "Jabalpur",
  "Jaipur",
  "Jammu",
  "Jamshedpur",
  "Jodhpur",
  "Kadapa",
  "Kannur",
  "Kanpur",
  "Kanyakumari",
  "Karimnagar",
  "Kochi",
  "Kolhapur",
  "Kolkata",
  "Korba",
  "Kurnool",
  "Lucknow",
  "Madurai",
  "Mangaluru",
  "Mumbai",
  "Nagpur",
  "Nellore",
  "Nizamabad",
  "Patna",
  "Port Blair",
  "Pune",
  "Raipur",
  "Rajahmundry",
  "Ranchi",
  "Salem",
  "Shillong",
  "Silchar",
  "Siliguri",
  "Srinagar",
  "Surat",
  "Tezpur",
  "Thiruvananthapuram",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirupati",
  "Tiruppur",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
];

export const DepartureCityCombobox: React.FC = () => {
  const dispatch = useAppDispatch();
  const departureCity = useAppSelector(
    (state) => state.booking.step1.departureCity,
  );
  const error = useAppSelector(
    (state) => state.booking.validation.step1Errors.departureCity,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(departureCity);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter cities based on search term
  const filteredCities = DEPARTURE_CITIES.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Sync searchTerm with Redux state when it changes externally
  useEffect(() => {
    setSearchTerm(departureCity);
  }, [departureCity]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Reset to selected value if user didn't select anything
        if (!DEPARTURE_CITIES.includes(searchTerm)) {
          setSearchTerm(departureCity);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchTerm, departureCity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSelectCity = (city: string) => {
    setSearchTerm(city);
    dispatch(setDepartureCity(city));
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm(departureCity);
    } else if (e.key === "Enter" && filteredCities.length > 0) {
      e.preventDefault();
      handleSelectCity(filteredCities[0]);
    }
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className={labelClass}>Departure City*</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className={getInputClass(!!error)}
          placeholder="Search or select city..."
          autoComplete="off"
        />
        {/* Dropdown arrow */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown list */}
        {isOpen && (
          <div data-lenis-prevent className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city}
                  onClick={() => handleSelectCity(city)}
                  className={`px-4 py-2 cursor-pointer text-gray-700 font-medium hover:bg-gray-100 ${
                    city === departureCity ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  {city}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No cities found
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
};
