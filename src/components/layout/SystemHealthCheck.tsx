"use client";

import { useEffect } from "react";
import { checkSystemHealth } from "@/app/actions/system-health";

export default function SystemHealthCheck() {
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await checkSystemHealth();

        if (result.status === "success") {
          console.log(
            "%c System Health Check: OK ",
            "background: #22c55e; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;",
            result.message,
          );
          console.log("Environment Check:", result.envCheck);
        } else {
          console.error(
            "%c System Health Check: FAILED ",
            "background: #ef4444; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;",
            result.message,
          );
          console.error("Environment Check:", result.envCheck);
          if (result.error) {
            console.error("Error Details:", result.error);
          }
        }
      } catch (error) {
        console.error("Failed to execute system health check:", error);
      }
    };

    checkHealth();
  }, []);

  return null;
}
