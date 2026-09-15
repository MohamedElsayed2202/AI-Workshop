import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'pulseboard.theme'

function readStoredPreference(): ThemePreference {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY)
		return stored === 'light' || stored === 'dark' ? stored : 'system'
	} catch {
		return 'system'
	}
}

/**
 * Stamps the explicit choice on <html> as data-theme. "system" stamps nothing,
 * leaving prefers-color-scheme in charge — which is what index.css expects.
 */
export function useTheme() {
	const [preference, setPreference] = useState<ThemePreference>(readStoredPreference)

	useEffect(() => {
		const root = document.documentElement
		if (preference === 'system') {
			root.removeAttribute('data-theme')
		} else {
			root.setAttribute('data-theme', preference)
		}

		try {
			if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY)
			else window.localStorage.setItem(STORAGE_KEY, preference)
		} catch {
			// Remembering the choice is a convenience, not a requirement.
		}
	}, [preference])

	const isDark =
		preference === 'dark' ||
		(preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

	const toggleTheme = useCallback(() => {
		setPreference((current) => {
			const nowDark =
				current === 'dark' ||
				(current === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
			return nowDark ? 'light' : 'dark'
		})
	}, [])

	return { preference, isDark, toggleTheme }
}
