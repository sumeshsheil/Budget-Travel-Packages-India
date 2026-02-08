"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { setTravelDate } from "@/lib/redux/features/bookingSlice";
import { labelClass, getInputClass, errorTextClass } from "../styles";

// Helper to format date as DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper to parse DD/MM/YYYY to Date
const parseDate = (dateStr: string): Date | null => {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

// Helper to get month name
const getMonthName = (month: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
};

// Helper to get days in month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get first day of month (0 = Sunday)
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const TravelDatePicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const travelDate = useAppSelector((state) => state.booking.step1.travelDate);
  const error = useAppSelector(
    (state) => state.booking.validation.step1Errors.travelDate,
  );

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate date constraints
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Minimum date: day after tomorrow (today + 2 days)
  const minDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    return d;
  }, [today]);

  // Maximum date: 1 year from today
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }, [today]);

  // Current calendar view state
  const [viewMonth, setViewMonth] = useState(() => minDate.getMonth());
  const [viewYear, setViewYear] = useState(() => minDate.getFullYear());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if a date is selectable
  const isDateSelectable = (date: Date): boolean => {
    return date >= minDate && date <= maxDate;
  };

  // Handle date selection
  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(viewYear, viewMonth, day);
    if (isDateSelectable(selectedDate)) {
      dispatch(setTravelDate(formatDate(selectedDate)));
      setIsOpen(false);
    }
  };

  // Navigate months
  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Check if can navigate to previous/next month
  const canGoPrevious = useMemo(() => {
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const lastDayOfPrevMonth = new Date(prevYear, prevMonth + 1, 0);
    return lastDayOfPrevMonth >= minDate;
  }, [viewMonth, viewYear, minDate]);

  const canGoNext = useMemo(() => {
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const firstDayOfNextMonth = new Date(nextYear, nextMonth, 1);
    return firstDayOfNextMonth <= maxDate;
  }, [viewMonth, viewYear, maxDate]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days: (number | null)[] = [];

    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [viewMonth, viewYear]);

  // Get selected date for highlighting
  const selectedDate = travelDate ? parseDate(travelDate) : null;

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className={labelClass}>Travel Dates*</label>
      <div className="relative">
        <input
          type="text"
          value={travelDate}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`${getInputClass(!!error)} cursor-pointer`}
          placeholder="Select date"
        />
        {/* Calendar icon */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {/* Calendar dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-72">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                disabled={!canGoPrevious}
                className={`p-1 rounded hover:bg-gray-100 ${
                  !canGoPrevious ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="font-semibold text-gray-800">
                {getMonthName(viewMonth)} {viewYear}
              </span>
              <button
                type="button"
                onClick={goToNextMonth}
                disabled={!canGoNext}
                className={`p-1 rounded hover:bg-gray-100 ${
                  !canGoNext ? "opacity-30 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="p-2" />;
                }

                const date = new Date(viewYear, viewMonth, day);
                const isSelectable = isDateSelectable(date);
                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === viewMonth &&
                  selectedDate.getFullYear() === viewYear;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDate(day)}
                    disabled={!isSelectable}
                    className={`p-2 text-sm rounded-lg transition-colors ${
                      isSelected
                        ? "bg-primary text-black font-bold"
                        : isSelectable
                          ? "hover:bg-gray-100 text-gray-700"
                          : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Info text */}
            <p className="text-xs text-gray-400 mt-3 text-center">
              Select a date from {formatDate(minDate)} to {formatDate(maxDate)}
            </p>
          </div>
        )}
      </div>
      {error && <p className={errorTextClass}>{error}</p>}
    </div>
  );
};
