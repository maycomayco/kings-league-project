export const getAllTeams = async () => {
	try {
		const response = await fetch('https://kings-league.maycobarale.workers.dev/teams')
		const teams = await response.json()
		return teams
	} catch (error) {
		// enviar el error a un servicio de monitoreo de errores
		return []
	}
}
