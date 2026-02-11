"use client";

import { useInactivityLogout } from "@/hooks/useInactivityLogout";

export function InactivityTracker() {
  useInactivityLogout();
  return null;
}
