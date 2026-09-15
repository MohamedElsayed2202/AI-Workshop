import { getAuthToken, handleUnauthorized } from './authToken'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

class HttpError extends Error {
	constructor(
		readonly status: number,
		message: string,
	) {
		super(message)
		this.name = 'HttpError'
	}
}

async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
	const token = getAuthToken()

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...init?.headers,
		},
	})

	if (!response.ok) {
		// A rejected session must drop the visitor back to the login page. Signing
		// in is the one request allowed to 401 without clearing anything.
		if (response.status === 401 && path !== '/login') handleUnauthorized()
		throw new HttpError(response.status, `${init?.method ?? 'GET'} ${path} failed`)
	}
	if (response.status === 204) return undefined as TResponse

	return (await response.json()) as TResponse
}

export const httpClient = {
	get: <TResponse>(path: string) => request<TResponse>(path),
	post: <TResponse>(path: string, body: unknown) =>
		request<TResponse>(path, { method: 'POST', body: JSON.stringify(body) }),
	patch: <TResponse>(path: string, body: unknown) =>
		request<TResponse>(path, { method: 'PATCH', body: JSON.stringify(body) }),
	delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}
