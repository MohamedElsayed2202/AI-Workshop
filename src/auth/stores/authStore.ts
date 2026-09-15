import { setAuthToken, setUnauthorizedHandler } from '@shared/api/authToken'
import { createStore } from '@shared/stores/createStore'
import type { Session } from '@/mocks/handlers/auth'

const STORAGE_KEY = 'pulseboard.session'

interface AuthState {
	session: Session | null
	signIn: (session: Session) => void
	signOut: () => void
}

function readStoredSession(): Session | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw) as Session
		return parsed?.token ? parsed : null
	} catch {
		// A blocked storage API, or a corrupted entry, is not worth reporting;
		// the visitor simply signs in again.
		return null
	}
}

function persistSession(session: Session | null): void {
	try {
		if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
		else window.localStorage.removeItem(STORAGE_KEY)
	} catch {
		// Staying signed in across reloads is a convenience, not a requirement.
	}
}

const restoredSession = readStoredSession()
setAuthToken(restoredSession?.token ?? null)

/**
 * The signed-in session. Module-level, so it outlives any route change, and
 * mirrored to localStorage so it outlives a reload.
 */
export const useAuthStore = createStore<AuthState>((set) => ({
	session: restoredSession,

	signIn: (session) => {
		persistSession(session)
		setAuthToken(session.token)
		set((state) => {
			state.session = session
		})
	},

	signOut: () => {
		persistSession(null)
		setAuthToken(null)
		set((state) => {
			state.session = null
		})
	},
}))

// A 401 from any other endpoint means the stored session is no longer good.
// Clearing it re-renders RequireAuth, which sends the visitor to /login.
setUnauthorizedHandler(() => {
	if (useAuthStore.getState().session) useAuthStore.getState().signOut()
})
