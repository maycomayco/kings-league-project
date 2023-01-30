import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { logSuccess } from './logs.js'

// path where the images are stored at the moment
const INPUT_PATH = path.join(process.cwd(), 'assets', 'static', 'players')
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'teams', 'players')
// constants for sharp library
const LOSSLESS = true
const QUALITY = 50

export const optimizePlayersImages = async () => {
	//read all the files in the directory
	const imageFiles = await readdir(INPUT_PATH)

	// function that will optimize the image
	const optimizeImage = async (file) => {
		const filePath = path.join(INPUT_PATH, file)
		// replace .jpg with .webp for the new location of the file
		const outputPath = path.join(OUTPUT_PATH, file.replace('.jpg', '.webp'))

		await sharp(filePath).webp({ lossless: LOSSLESS, quality: QUALITY }).toFile(outputPath)
		logSuccess(`Optimized image ${file}!`)
	}

	// run the optimization for all images with Promise.all()
	await Promise.all(imageFiles.map(optimizeImage))
}
