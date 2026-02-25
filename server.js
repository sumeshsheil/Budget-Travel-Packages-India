/**
 * Custom server entry point for Hostinger cPanel (shared hosting).
 *
 * Hostinger's "Setup Node.js App" expects a root-level server.js.
 * This file bootstraps the Next.js standalone server with proper
 * hostname/port bindings for the Passenger reverse proxy.
 *
 * Usage (cPanel sets PORT automatically):
 *   NODE_ENV=production node server.js
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const path = require("path");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({
  dev: false,
  dir: __dirname,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log(
      `> Next.js production server running on http://${hostname}:${port}`,
    );
  });
});
