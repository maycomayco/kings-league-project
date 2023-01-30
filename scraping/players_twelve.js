import path from 'node:path'
import sharp from 'sharp'

import { TEAMS } from '../db/index.js'
import { cleanText } from './utils.js'

const PLAYER_FOLDER_PATH = path.join(process.cwd(), './public/teams/players')

const PLAYER_SELECTORS = {
	firstName: { selector: '.fs-grid-fieldset-3 h3:first-child', typeOf: 'string' },
	lastName: { selector: '.fs-grid-fieldset-3 h3:last-child', typeOf: 'string' },
	teamName: { selector: '.el-item .fs-grid-text-2', typeOf: 'string' },
	role: {
		selector: '.el-item .fs-grid-fieldset-1 .fs-grid-meta-1',
		typeOf: 'string'
	}
}

let counter = 1000

const extractIdFromUrl = (url) => url.split('/').at(-1).split('.').at(0)

const generateIdForPlayer = ({ teamId, image }) => {
	const imageId = extractIdFromUrl(image)
	const playerId = imageId === 'placeholder' ? counter++ : imageId
	return `${teamId}-${playerId}`
}

export async function getPlayersTwelve($) {
	const $rows = $('div.fs-load-more-item.fs-mw')

	const getTeamFrom = ({ name }) => TEAMS.find((team) => team.name === name)

	const playerSelectorEntries = Object.entries(PLAYER_SELECTORS)
	const players = []

	$rows.each((_, el) => {
		const playerEntries = playerSelectorEntries.map(([key, { selector, typeOf }]) => {
			const rawValue = $(el).find(selector).text()
			const cleanedValue = cleanText(rawValue)

			const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue

			return [key, value]
		})

		const { teamName, firstName, lastName, ...playerInfo } = Object.fromEntries(playerEntries)

		const name = `${firstName} ${lastName}`

		const team = getTeamFrom({ name: teamName })

		const image = $(el).find('.el-image.uk-invisible').attr('src')

		players.push({
			...playerInfo,
			firstName,
			lastName,
			image,
			name,
			id: generateIdForPlayer({ teamId: team.id, image }),
			team: {
				id: team.id,
				name: teamName,
				image: team.image,
				imageWhite: team.imageWhite
			}
		})
	})

	for (const player of players) {
		const imageURL = await saveImageBase64(player)
		player.image = imageURL
	}

	return players
}

async function saveImageBase64(player) {
	const { firstName, lastName, team, image } = player

	if (image.includes('placeholder.png')) {
		return 'placeholder.png'
	}

	let playerImage = null
	try {
		const imageName = lastName
			? `${team.id}-${firstName.toLowerCase()}-${lastName.toLowerCase()}.webp`
			: `${team.id}-${firstName.toLowerCase()}.webp`

		const normalizedImageName = imageName
			.normalize('NFD')
			.replace(/\s+/g, '-')
			.replace(/[\u0300-\u036f]/g, '')

		const res = await fetch(image)

		const imgArrayBuffer = await res.arrayBuffer()
		const buffer = Buffer.from(imgArrayBuffer)

		const imageFilePath = `${PLAYER_FOLDER_PATH}/${normalizedImageName}`
		await sharp(buffer).webp().toFile(imageFilePath)

		playerImage = `${normalizedImageName}`
	} catch (error) {
		console.log(error)
	}

	return playerImage
}
