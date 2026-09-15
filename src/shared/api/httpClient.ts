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
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers: { 'Content-Type': 'application/json', ...init?.headers },
	})

	if (!response.ok) throw new HttpError(response.status, `${init?.method ?? 'GET'} ${path} failed`)
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
