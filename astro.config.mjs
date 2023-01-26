import { defineConfig } from 'astro/config'

// https://astro.build/config
import tailwind from '@astrojs/tailwind'
import critters from 'astro-critters'

// TODO, add prefetch astro plugin

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), critters()]
})
