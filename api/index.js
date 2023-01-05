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
import leaderboard from "../db/leaderboard.json";

const app = new Hono();

app.get("/", (ctx) => ctx.text("Hono web!!"));

app.get("/leaderboard", (ctx) => ctx.json(leaderboard));

export default app;
