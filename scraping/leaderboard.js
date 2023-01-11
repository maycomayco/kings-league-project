// ES6 or TypeScript:
import * as cheerio from "cheerio";
import { writeDBFile, TEAMS, PRESIDENTS } from "../db/index.js";
import { URLS, scrape } from "./utils.js";

const getLeaderboard = async () => {
  const $ = await scrape(URLS.leaderboard);
  const $rows = $("table tbody tr");

  const LEADERBOARD_SELECTORS = {
    team: { selector: ".fs-table-text_3", typeOf: "string" },
    wins: { selector: ".fs-table-text_4", typeOf: "number" },
    losses: { selector: ".fs-table-text_5", typeOf: "number" },
    scoredGoals: { selector: ".fs-table-text_6", typeOf: "number" },
    concededGoals: { selector: ".fs-table-text_7", typeOf: "number" },
    yellowCards: { selector: ".fs-table-text_8", typeOf: "number" },
    redCards: { selector: ".fs-table-text_9", typeOf: "number" },
  };

  const getTeamFrom = (name) => {
    const { presidentId, ...restOfTeam } = TEAMS.find(
      (team) => team.name === name
    );
    // search for a president with the presidentId
    const president = PRESIDENTS.find(
      (president) => president.id === presidentId
    );

    // join the team data with the president data
    return { ...restOfTeam, president };
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

    const team = getTeamFrom(teamName);

    leaderboard.push({ ...leaderboardForTeam, team });
  });

  return leaderboard;
};

const leaderboardOutput = await getLeaderboard();

/*
  - path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
  - process.cwd() returns the current working directory of the Node.js process
*/

// const filePath = path.join(process.cwd(), "db/leaderboard.json");

// await writeFile(filePath, JSON.stringify(leaderboardOutput, null, 2), "utf-8");
await writeDBFile("leaderboard", leaderboardOutput);
