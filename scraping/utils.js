import * as cheerio from 'cheerio'

import { getAssists } from './top_assists.js'
// import { getCoaches } from './coaches.js'
import { getLeaderboard } from './leaderboard.js'
import { getMvp } from './mvp.js'
import { getTopScorerList } from './top_scorers.js'
import { getPlayersTwelve } from './players_twelve.js'
import { getSchedule } from './schedule.js'
import { logError, logInfo, logSuccess } from './logs.js'

import { writeDBFile } from '../db/index.js'
import { getTopStatistics } from './top_statistics.js'

export const SCRAPINGS = {
	leaderboard: {
		url: 'https://kingsleague.pro/estadisticas/clasificacion/',
		scraper: getLeaderboard
	},
	mvp: {
		url: 'https://kingsleague.pro/estadisticas/mvp/',
		scraper: getMvp
	},
	// coaches: {
	// 	url: 'https://es.besoccer.com/competicion/info/kings-league/2023',
	// 	scraper: getCoaches
	// },
	top_scorers: {
		url: 'https://kingsleague.pro/estadisticas/goles/',
		scraper: getTopScorerList
	},
	top_assists: {
		url: 'https://kingsleague.pro/estadisticas/asistencias/',
		scraper: getAssists
	},
	players_twelve: {
		url: 'https://kingsleague.pro/jugador-12/',
		scraper: getPlayersTwelve
	},
	schedule: {
		url: 'https://kingsleague.pro/calendario/',
		scraper: getSchedule
	},
	top_statistics: {
		scraper: getTopStatistics
	}
}

// method to scrapte a specific url
export async function scrape(url) {
	const res = await fetch(url)
	const html = await res.text()
	return cheerio.load(html)
}

// method to clean text from a rows
export const cleanText = (text) =>
	text
		.replace(/\t|\n|\s:/g, '')
		.replace(/.*:/g, ' ')
		.trim()

export const scrapeAndSave = async (name) => {
	// empezamos a medir el tiempo de ejecución de la función
	const start = performance.now()

	try {
		const { scraper, url } = SCRAPINGS[name]

		logInfo(`Scraping [${name}] list...`)
		const cheerioResult = url ? await scrape(url) : null
		// ejecutamos la función scraper por parametro
		const content = await scraper(cheerioResult)
		logSuccess(`[${name}] scraped successfully!`)

		logInfo(`Writing [${name}] to DB...`)
		await writeDBFile(name, content)
		logSuccess(`[${name}] written to DB successfully!`)
	} catch (error) {
		logError(`Error scraping [${name}]!`)
		logError(error)
	} finally {
		// tomamos el tiempo de ejecución de la función hasta aqui
		const end = performance.now()
		// calculamos el tiempo de ejecución de la función en segundos (time/1000)
		const time = (end - start) / 1000
		logInfo(`[${name}] scraped in ${time} seconds`)
	}
}
