import { scrapeAndSave, SCRAPINGS } from "./utils.js";

/*
	top level await, https://v8.dev/features/top-level-await
	Promise.all() es usado para lanzar dos promesas al mismo tiempo, hay que tener cuidado porque al lanzar muchas promesas al mismo tiempo, puede saturar el servidor y hacer que el servidor no responda a las peticiones o nos banee
*/
// await Promise.all([scrapeAndSave("leaderboard"), scrapeAndSave("mvp")]);

/*
	con el for of, se lanza una promesa por cada iteración, por lo que no saturamos el servidor
	al tener el await, se espera a que termine la promesa para pasar a la siguiente iteración
*/
for (const item of Object.keys(SCRAPINGS)) {
  await scrapeAndSave(item);
}
