import { http, HttpResponse } from 'msw'

/**
 * Workshop credentials. A real deployment replaces this handler with a call to
 * the identity provider; nothing outside src/mocks/ knows these values.
 */
const VALID_USERNAME = 'root'
const VALID_PASSWORD = 'root'

export interface LoginPayload {
	username: string
	password: string
}

export interface Session {
	token: string
	username: string
}

export const authHandlers = [
	http.post('/api/login', async ({ request }) => {
		const { username, password } = (await request.json()) as LoginPayload

		if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
			return HttpResponse.json({ message: 'Incorrect username or password.' }, { status: 401 })
		}

		return HttpResponse.json<Session>({ token: `session-${Date.now()}`, username })
	}),
]
