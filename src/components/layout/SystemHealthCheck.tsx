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
            "%c[Budget Travel] ✅ System Health: OK ",
            "background: #22c55e; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold; margin-bottom: 4px;",
            result.message,
          );
          console.table(result.envCheck);
        } else if (result.status === "warning") {
          console.warn(
            "%c[Budget Travel] ⚠️ System Health: WARNING ",
            "background: #f59e0b; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold; margin-bottom: 4px;",
            result.message,
          );
          console.table(result.envCheck);
        } else {
          console.error(
            "%c[Budget Travel] ❌ System Health: FAILED ",
            "background: #ef4444; color: white; padding: 2px 4px; border-radius: 4px; font-weight: bold; margin-bottom: 4px;",
            result.message,
          );
          console.table(result.envCheck);
          if (result.error) {
            console.groupCollapsed("Server Error Details");
            console.error(result.error);
            console.groupEnd();
          }
        }
        console.log(
          `%cCheck Timestamp: ${result.timestamp}`,
          "color: #64748b; font-size: 10px;",
        );
      } catch (error) {
        console.error("Failed to execute system health check:", error);
      }
    };

    checkHealth();
  }, []);

  return null;
}
