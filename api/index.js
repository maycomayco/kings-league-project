/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Hono } from "hono";
import { serveStatic } from "hono/serve-static.module";
import leaderboard from "../db/leaderboard.json";

const app = new Hono();

app.get("/", (ctx) =>
  ctx.json({
    message: "Hello, World!",
  })
);

app.get("/leaderboard", (ctx) => ctx.json(leaderboard));

// This middleware distributes asset files that are put in directory specified root or path option.
app.get("/static/*", serveStatic({ root: "./" }));

export default app;
