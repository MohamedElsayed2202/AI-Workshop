import { http, HttpResponse } from 'msw'
import { getDatabase } from '../db'

export const dashboardHandlers = [
	http.get('/api/dashboard', async () => {
		const { meta, kpis, revenueSeries, accounts } = await getDatabase()
		return HttpResponse.json({ meta, kpis, revenueSeries, accounts })
	}),
]
