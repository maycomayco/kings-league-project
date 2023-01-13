import { getImageFromTeam } from '../db/index.js'
import { cleanText } from './utils.js'

export const getMvp = async (cheerioInput) => {
	const $rows = cheerioInput('table tbody tr')

	const MVP_SELECTORS = {
		team: { selector: '.fs-table-text_3', typeOf: 'string' },
		playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
		gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
		mvps: { selector: '.fs-table-text_6', typeOf: 'number' }
	}

	// const getImageFromTeam = ({ name }) => {
	//   const { image } = TEAMS.find((team) => team.name === name);
	//   return image;
	// };

	const mvpSelectorEntries = Object.entries(MVP_SELECTORS)
	const mvpList = []
	$rows.each((index, el) => {
		const $el = cheerioInput(el)
		const mvpEntries = mvpSelectorEntries.map(([key, { selector, typeOf }]) => {
			const rawValue = $el.find(selector).text()
			const cleanedValue = cleanText(rawValue)

			const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue

			return [key, value]
		})
		const { team: teamName, ...mvpData } = Object.fromEntries(mvpEntries)
		const image = getImageFromTeam({ name: teamName })

		mvpList.push({
			...mvpData,
			rank: index + 1,
			team: teamName,
			image
		})
	})

	return mvpList
}
