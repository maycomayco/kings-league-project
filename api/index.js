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

// databases to read from
import leaderboard from "../db/leaderboard.json";
import presidents from "../db/presidents.json";
import teams from "../db/teams.json";

const app = new Hono();

app.get("/", (ctx) =>
  ctx.json([
    {
      endpoint: "/leaderboard",
      description: "Returns the leaderboard",
    },
    {
      endpoint: "/teams",
      description: "Returns the teams",
    },
    {
      endpoint: "/presidents",
      description: "Returns the presidents",
    },
  ])
);

// DB endpoints
app.get("/leaderboard", (ctx) => {
  return ctx.json(leaderboard);
});

app.get("/presidents", (ctx) => {
  return ctx.json(presidents);
});

app.get("/presidents/:id", (ctx) => {
  const id = ctx.req.param("id");
  const president = presidents.find((president) => president.id === id);

  return president
    ? ctx.json(president)
    : ctx.json({ message: "president not found" }, 404);
});

app.get("/teams", (ctx) => {
  return ctx.json(teams);
});

// This middleware distributes asset files that are put in directory specified root or path option.
app.get("/static/*", serveStatic({ root: "./" }));

export default app;
