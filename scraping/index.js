// ES6 or TypeScript:
import * as cheerio from "cheerio";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "db");
const TEAMS = await readFile(path.join(DB_PATH, "teams.json"), "utf-8").then(
  JSON.parse
);

const URLS = {
  leaderboard: "https://kingsleague.pro/estadisticas/clasificacion/",
};

const scrape = async (url) => {
  const resp = await fetch(url);
  const html = await resp.text();
  const $ = cheerio.load(html);
  return $;
};

const getLeaderboard = async () => {
  const $ = await scrape(URLS.leaderboard);
  const $rows = $("table tbody tr");

  const LEADERBOARD_SELECTORS = {
    team: { selector: ".fs-table-text_3", typeOf: "string" },
    wins: { selector: ".fs-table-text_4", typeOf: "number" },
    loses: { selector: ".fs-table-text_5", typeOf: "number" },
    scoredGoals: { selector: ".fs-table-text_6", typeOf: "number" },
    concededGoals: { selector: ".fs-table-text_7", typeOf: "number" },
    yellowCards: { selector: ".fs-table-text_8", typeOf: "number" },
    redCards: { selector: ".fs-table-text_9", typeOf: "number" },
  };

  const getTeamFromName = (name) => {
    const team = TEAMS.find((team) => team.name === name);
    return team;
  };

  const cleanText = (text) =>
    text
      .replace(/\t|\n|\s:/g, "")
      .replace(/.*:/g, "")
      .trim();

  const leaderboardSelectorsEntries = Object.entries(LEADERBOARD_SELECTORS);

  const leaderboard = [];

  $rows.each((idx, el) => {
    // each row is a team
    const leaderboardEntries = leaderboardSelectorsEntries.map(
      ([key, { selector, typeOf }]) => {
        // each selector is a column with data in a table
        const rawValue = $(el).find(selector).text();
        const cleanedValue = cleanText(rawValue);
        //identify the type of the value and convert it to the correct type
        const value = typeOf === "number" ? Number(cleanedValue) : cleanedValue;

        return [key, value];
      }
    );
    const { team: teamName, ...leaderboardForTeam } =
      Object.fromEntries(leaderboardEntries);
    const team = getTeamFromName(teamName);

    // leaderboard.push(Object.fromEntries(leaderboardEntries));
    leaderboard.push({ ...leaderboardForTeam, team });
  });

  return leaderboard;
};

const leaderboardOutput = await getLeaderboard();

/*
  - path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
  - process.cwd() returns the current working directory of the Node.js process
*/

const filePath = path.join(process.cwd(), "db/leaderboard.json");

await writeFile(filePath, JSON.stringify(leaderboardOutput, null, 2), "utf-8");
