/**
 * The bearer token the HTTP client sends, kept here so `shared` never has to
 * import from a feature module. The auth store is what writes to it.
 */
let currentToken: string | null = null
let unauthorizedHandler: (() => void) | null = null

export function setAuthToken(token: string | null): void {
	currentToken = token
}

export function getAuthToken(): string | null {
	return currentToken
}

/** Called when the API rejects a request as unauthenticated. */
export function setUnauthorizedHandler(handler: () => void): void {
	unauthorizedHandler = handler
}

export function handleUnauthorized(): void {
	unauthorizedHandler?.()
}
