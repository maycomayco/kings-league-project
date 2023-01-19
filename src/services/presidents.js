export const findPresidentBy = async ({ id }) => {
	try {
		const response = await fetch(`https://kings-league.maycobarale.workers.dev/presidents/${id}`)
		const president = await response.json()
		return president
	} catch (error) {
		// enviar el error a un servicio de monitoreo de errores
		return null
	}
}
