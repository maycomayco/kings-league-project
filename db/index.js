import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

// general DB path
const DB_PATH = path.join(process.cwd(), "./db/");

// Read DB file
const readDBFile = async (dbName) => {
  return readFile(path.join(DB_PATH, `${dbName}.json`), "utf-8").then(
    JSON.parse
  );
};

export const writeDBFile = async (dbName, data) => {
  return writeFile(
    path.join(DB_PATH, `${dbName}.json`),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
};

export function getImageFromTeam({ name }) {
  const { image } = TEAMS.find((team) => team.name === name);
  return image;
}

// general files to read in the entire project
export const TEAMS = await readDBFile("teams");
export const PRESIDENTS = await readDBFile("presidents");
