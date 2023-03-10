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
import playersTwelve from '../db/players_twelve.json'
import schedule from '../db/schedule.json'
import topStatistics from '../db/top_statistics.json'

const app = new Hono()

app.get('/', (ctx) =>
	ctx.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns the leaderboard',
			parameters: [
				{
					name: 'team',
					endpoint: '/leaderboard/:teamId',
					description: 'Return the Kings League leaderboard information for a team by his id'
				}
			]
		},
		{
			endpoint: '/teams',
			description: 'Returns Kings League teams',
			parameters: [
				{
					name: 'id',
					endpoint: '/teams/:id',
					description: 'Return Kings League team by id'
				},
				{
					name: 'id',
					endpoint: '/teams/:id/player-12',
					description: 'Return player 12 by id for a team'
				}
			]
		},
		{
			endpoint: '/presidents',
			description: 'Returns Kings League presidents',
			parameters: [
				{
					name: 'id',
					endpoint: '/presidents/:id',
					description: 'Return Kings League president by id'
				}
			]
		},
		{
			endpoint: '/coaches',
			description: 'Returns Kings League coaches'
		},
		{
			endpoint: '/top-assists',
			description: 'Returns Kings League Top Assists',
			parameters: [
				{
					name: 'id',
					endpoint: '/top-assists/:id',
					description: 'Return Kings League top assister by rank'
				}
			]
		},
		{
			endpoint: '/top-scorers',
			description: 'Returns Kings League Top Scorers',
			parameters: [
				{
					name: 'id',
					endpoint: '/top-scorers/:id',
					description: 'Return Kings League top scorer by rank'
				}
			]
		},
		{
			endpoint: '/mvp',
			description: 'Returns Kings League MVPs'
		},
		{
			endpoint: '/players-12',
			description: 'Returns Kings League Players Twelve'
		},
		{
			endpoint: '/schedule',
			description: 'Returns Kings League match schedule and the final score of played games.'
		}
	])
)

// DB endpoints
app.get('/leaderboard', (ctx) => {
	return ctx.json(leaderboard)
})

app.get('/leaderboard/:teamId', (ctx) => {
	const teamId = ctx.req.param('teamId')
	const foundTeam = leaderboard.find((stats) => stats.team.id === teamId)

	return foundTeam ? ctx.json(foundTeam) : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/teams', (ctx) => {
	return ctx.json(teams)
})

app.get('/teams/:id', (ctx) => {
	const id = ctx.req.param('id')
	const foundTeam = teams.find((team) => team.id === id)

	return foundTeam ? ctx.json(foundTeam) : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/teams/:id/players-12', (ctx) => {
	const id = ctx.req.param('id')
	const foundPlayer = playersTwelve.filter((player) => player.team.id === id)

	return foundPlayer
		? ctx.json(foundPlayer)
		: ctx.json({ message: `Players for team ${id} not found` }, 404)
})

app.get('/coaches/:teamId', (ctx) => {
	const teamId = ctx.req.param('teamId')
	const teamName = teams.find((team) => team.id === teamId)
	const foundedCoach = coaches.find((coach) => coach.teamName === teamName)

	return foundedCoach ? ctx.json(foundedCoach) : ctx.json({ message: 'Coach not found' }, 404)
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

app.get('/top-assists/:rank', (ctx) => {
	const ranking = ctx.req.param('rank')
	const foundAssister = topAssists.find((assister) => assister.rank === ranking)

	return foundAssister
		? ctx.json(foundAssister)
		: ctx.json({ message: 'Top assister not found' }, 404)
})

app.get('/top-scorers', (ctx) => {
	return ctx.json(topScorers)
})

app.get('/top-scorers/:rank', (ctx) => {
	const ranking = ctx.req.param('rank')
	const foundScorer = topScorers.find((scorer) => scorer.ranking === ranking)

	return foundScorer ? ctx.json(foundScorer) : ctx.json({ message: 'Top scorer not found' }, 404)
})

app.get('/mvp', (ctx) => {
	return ctx.json(mvp)
})

app.get('/players-12', (ctx) => {
	return ctx.json(playersTwelve)
})

app.get('/top-assists', (ctx) => {
	return ctx.json(topAssists)
})

app.get('/top-statistics', (ctx) => {
	return ctx.json(topStatistics)
})

app.get('/schedule', (ctx) => {
	return ctx.json(schedule)
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
