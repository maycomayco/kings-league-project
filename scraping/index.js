import { writeDBFile } from '../db/index.js'
import { logInfo } from './logs.js'
import { getShortNameTeams } from './short_name_teams.js'
import { getURLTeams } from './url_teams.js'
import { scrapeAndSave, SCRAPINGS } from './utils.js'

// get first parameter from command line
const [, , scrapeParam] = process.argv

if (scrapeParam) {
	logInfo(`Scraping specific page ${scrapeParam}...`)
	// const infoToScrape = SCRAPINGS[scrapeParam]
	await scrapeAndSave(scrapeParam)
} else {
	logInfo('Scraping all pages...')
	/*
	con el for of, se lanza una promesa por cada iteración, por lo que no saturamos el servidor
	al tener el await, se espera a que termine la promesa para pasar a la siguiente iteración
*/
	for (const item of Object.keys(SCRAPINGS)) {
		await scrapeAndSave(item)
	}

	// Ahí lo añado a que se ejecute luego de que haga el scraping de las paginas ya que este como tal no scrapea sino que lo genera automáticamente en local.
	const teamsWithUrl = await getURLTeams()
	await writeDBFile('teams', teamsWithUrl)
	// Update file of teams.json with short name of each team
	await writeDBFile('teams', getShortNameTeams())
}

/*
	top level await, https://v8.dev/features/top-level-await
	Promise.all() es usado para lanzar dos promesas al mismo tiempo, hay que tener cuidado porque al lanzar muchas promesas al mismo tiempo, puede saturar el servidor y hacer que el servidor no responda a las peticiones o nos banee
*/
// await Promise.all([scrapeAndSave("leaderboard"), scrapeAndSave("mvp")]);

/*
Es un método que utiliza un patrón de la url de la información de cada equipo de la pagina oficial.

Explicacion de patron de la url:
Las url de la información de cada equipo tiene siempre el patrón de la url base 'https://kingsleague.pro/team/'
añadiéndole el id del equipo.
*/
