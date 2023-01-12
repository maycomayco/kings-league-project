import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { logInfo, logSuccess } from "./log";

const STATICS_PATH = path.join(process.cwd(), "./assets/static/presidents");
const DB_PATH = path.join(process.cwd(), "./db");

const RAW_PRESIDENTS = await readFile(
  `${DB_PATH}/raw-presidents.json`,
  "utf-8"
).then(JSON.parse);

const presidents = await Promise.all(
  RAW_PRESIDENTS.map(async (presidentInfo) => {
    // get initial data
    const { slug: id, title, _links: links } = presidentInfo;
    const { rendered: name } = title;

    const { "wp:attachment": attachment } = links;
    logInfo(`> Fetching attachment for president: ${name}`);

    // image URL
    const { href: imageApiEndpoint } = attachment[0];

    console.log(`Fetching attachment for ${name}...`);

    const responseImageEndpoint = await fetch(imageApiEndpoint);
    const data = await responseImageEndpoint.json();
    const [imageInfo] = data;

    const { guid } = imageInfo;
    const { rendered: imageUrl } = guid;

    //get file extension
    const extension = imageUrl.split(".").at(-1);

    logInfo(`> Fetching image for president: ${name}`);

    // download image file with buffer
    const responseImage = await fetch(imageUrl);
    const arrayBuffer = await responseImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    logInfo(`> Writing image to disk ${name}`);
    // console.log(`Writing img to disk for ${name}...`);

    // write image file to disk
    const imageFileName = `${id}.${extension}`;
    await writeFile(`${STATICS_PATH}/${imageFileName}`, buffer);

    logInfo(`> Everything is done! ${name}`);
    return { id, name, image: imageFileName, teamId: 0 };
  })
);

logSuccess("> All presidents are done!");
// console.log("All presidents are done!");
await writeFile(
  `${DB_PATH}/presidents.json`,
  JSON.stringify(presidents, null, 2)
);
