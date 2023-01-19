import { apiURL } from './config'

export const findPresidentBy = async ({ id }) => {
	try {
		const response = await fetch(`${apiURL}/presidents/${id}`)
		const president = await response.json()
		return president
	} catch (error) {
		// enviar el error a un servicio de monitoreo de errores
		return null
	}
}
