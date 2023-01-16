/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'

// databases to read from
import topAssists from '../db/top_assists.json'
import coaches from '../db/coaches.json'
import leaderboard from '../db/leaderboard.json'
import mvp from '../db/mvp.json'
import presidents from '../db/presidents.json'
import teams from '../db/teams.json'
import topScorers from '../db/top_scorers.json'

const app = new Hono()

app.get('/', (ctx) =>
	ctx.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns the leaderboard'
		},
		{
			endpoint: '/teams',
			description: 'Returns Kings League teams',
			parameters: [
				{
					name: 'id',
					endpoint: '/teams/:id'
				}
			]
		},
		{
			endpoint: '/presidents',
			description: 'Returns Kings League presidents',
			parameters: [
				{
					name: 'id',
					endpoint: '/presidents/:id'
				}
			]
		},
		{
			endpoint: '/coaches',
			description: 'Returns Kings League coaches'
		},
		{
			endpoint: '/top-assists',
			description: 'Returns Kings League Top Assists'
		},
		{
			endpoint: '/top-scorers',
			description: 'Returns Kings League Top Scorers'
		},
		{
			endpoint: '/mvp',
			description: 'Returns Kings League MVPs'
		}
	])
)

// DB endpoints
app.get('/leaderboard', (ctx) => {
	return ctx.json(leaderboard)
})

app.get('/teams', (ctx) => {
	return ctx.json(teams)
})

app.get('/teams/:id', (ctx) => {
	const id = ctx.req.param('id')
	const foundTeam = teams.find((team) => team.id === id)

	return foundTeam ? ctx.json(foundTeam) : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/presidents', (ctx) => {
	return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
	const id = ctx.req.param('id')
	const president = presidents.find((president) => president.id === id)

	return president ? ctx.json(president) : ctx.json({ message: 'president not found' }, 404)
})

app.get('/coaches', (ctx) => {
	return ctx.json(coaches)
})

app.get('/top-assists', (ctx) => {
	return ctx.json(topAssists)
})

app.get('/top-scorers', (ctx) => {
	return ctx.json(topScorers)
})

app.get('/mvp', (ctx) => {
	return ctx.json(mvp)
})

// This middleware distributes asset files that are put in directory specified root or path option.
app.get('/static/*', serveStatic({ root: './' }))

// not found handler for trailins slash
app.notFound((c) => {
	const { pathname } = new URL(c.req.url)

	// redirect to non-trailing slash url
	if (c.req.url.at(-1) === '/') {
		return c.redirect(pathname.slice(0, -1))
	}

	return c.json({ message: 'Not Found' }, 404)
})

export default app
