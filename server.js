/**
 * Minimal Standalone Wrapper for Hostinger cPanel Passenger
 *
 * Hostinger's LiteSpeed Passenger proxy requires a traditional root entry point.
 * This wrapper passes execution directly to the built-in standalone server
 * which is heavily optimized and already handles Next.js specific routing.
 */

// Passenger overrides PORT, but we need to ensure HOSTNAME is set to allow reverse proxy connections
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
// Tell Next.js we are in production
process.env.NODE_ENV = "production";

// The standalone server.js usually requires its config file, which is adjacent to it.
// To run it from the root, we must change the working directory:
process.chdir(__dirname + "/.next/standalone");

// Pass execution to the auto-generated standalone server
require("./.next/standalone/server.js");
