"use client";

import { useEffect } from "react";

/**
 * SystemHealthCheck — Runs on every page load and logs server diagnostics
 * to the browser console. Uses an API route (/api/health) instead of
 * Server Actions for reliable operation on Hostinger standalone deployments.
 */
export default function SystemHealthCheck() {
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health");
        const result = await res.json();

        const styles = {
          success:
            "background: #22c55e; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;",
          warning:
            "background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;",
          error:
            "background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;",
        };

        const label =
          result.status === "success"
            ? "✅ OK"
            : result.status === "warning"
              ? "⚠️ WARNING"
              : "❌ FAILED";

        const method =
          result.status === "error"
            ? "error"
            : result.status === "warning"
              ? "warn"
              : "log";

        console[method](
          `%c[Budget Travel] ${label} `,
          styles[result.status as keyof typeof styles] || styles.error,
          result.message,
        );
        console.table(result.envCheck);

        if (result.error) {
          console.groupCollapsed("Server Error Details");
          console.error(result.error);
          console.groupEnd();
        }

        console.log(
          `%cTimestamp: ${result.timestamp}`,
          "color: #64748b; font-size: 10px;",
        );
      } catch (error) {
        console.error(
          "%c[Budget Travel] ❌ Health check fetch failed ",
          "background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;",
          error,
        );
      }
    };

    checkHealth();
  }, []);

  return null;
}
