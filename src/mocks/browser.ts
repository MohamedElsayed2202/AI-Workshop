import { setupWorker } from 'msw/browser'
import { dashboardHandlers } from './handlers/dashboard'
import { usersHandlers } from './handlers/users'

export const worker = setupWorker(...dashboardHandlers, ...usersHandlers)

/**
 * Started before the first render so no query can ever fire unmocked.
 * `bypass` keeps Vite's own HMR and asset requests off the console.
 */
export function startMockServer(): Promise<unknown> {
	return worker.start({
		onUnhandledRequest: 'bypass',
		quiet: true,
		serviceWorker: { url: '/mockServiceWorker.js' },
	})
}
