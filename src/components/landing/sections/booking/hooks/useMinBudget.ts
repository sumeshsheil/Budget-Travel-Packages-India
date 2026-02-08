import { useMemo } from "react";
import { useAppSelector } from "@/lib/redux/store";

/**
 * Custom hook to calculate minimum budget based on trip type, duration, and guests
 */
export const useMinBudget = () => {
  const tripType = useAppSelector((state) => state.booking.step1.tripType);
  const duration = useAppSelector((state) => state.booking.step1.duration);
  const guests = useAppSelector((state) => state.booking.step1.guests);

  const days = useMemo(() => {
    const match = duration.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }, [duration]);

  const minBudget = useMemo(() => {
    const ratePerPersonPerDay = tripType === "international" ? 1000 : 500;
    return guests * days * ratePerPersonPerDay;
  }, [guests, days, tripType]);

  return { days, minBudget };
};
