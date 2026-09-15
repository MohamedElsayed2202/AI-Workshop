import { createStore } from '@shared/stores/createStore'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'pulseboard.theme'

interface ThemeState {
	preference: ThemePreference
	systemPrefersDark: boolean
	setPreference: (preference: ThemePreference) => void
	toggleTheme: () => void
}

function readStoredPreference(): ThemePreference {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY)
		return stored === 'light' || stored === 'dark' ? stored : 'system'
	} catch {
		// A blocked storage API just means the visitor starts on the system theme.
		return 'system'
	}
}

function persistPreference(preference: ThemePreference): void {
	try {
		if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY)
		else window.localStorage.setItem(STORAGE_KEY, preference)
	} catch {
		// Remembering the choice is a convenience, not a requirement.
	}
}

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

/**
 * The theme preference. Module-level, so the toggle in the header and the
 * ThemeRoot that paints the page read one value: held in component state, each
 * of them got a private copy and the page only caught up on a reload. Mirrored
 * to localStorage so the choice survives that reload.
 */
export const useThemeStore = createStore<ThemeState>((set, get) => ({
	preference: readStoredPreference(),
	systemPrefersDark: darkQuery.matches,

	setPreference: (preference) => {
		persistPreference(preference)
		set((state) => {
			state.preference = preference
		})
	},

	toggleTheme: () => {
		get().setPreference(selectIsDark(get()) ? 'light' : 'dark')
	},
}))

/** "system" follows the OS; an explicit choice overrides it in both directions. */
export function selectIsDark(state: ThemeState): boolean {
	return state.preference === 'dark' || (state.preference === 'system' && state.systemPrefersDark)
}

// Keep "system" honest when the OS theme changes while the app is open.
darkQuery.addEventListener('change', (event) => {
	useThemeStore.setState((state) => {
		state.systemPrefersDark = event.matches
	})
})
