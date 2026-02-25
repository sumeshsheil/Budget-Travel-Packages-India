/**
 * Hostinger cPanel entry point.
 *
 * This is a thin wrapper that sets HOSTNAME and PORT before
 * handing off to the Next.js standalone server.
 *
 * - cPanel Passenger sets PORT automatically.
 * - HOSTNAME must be 0.0.0.0 so Passenger can proxy to it.
 * - The actual Next.js server logic lives in the auto-generated
 *   .next/standalone/server.js — we never overwrite it.
 *
 * In cPanel "Setup Node.js App", set startup file to: server.js
 */

// Ensure correct binding for Passenger reverse proxy
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

// Load and run the Next.js standalone server
require("./server.js.next");
