import { selectIsDark, useThemeStore } from '@shared/stores/themeStore'

export type { ThemePreference } from '@shared/stores/themeStore'

/**
 * The current theme. Every consumer reads the same shared store, so the toggle
 * and the ThemeRoot that applies the colours can never disagree.
 */
export function useTheme() {
	const preference = useThemeStore((state) => state.preference)
	const isDark = useThemeStore(selectIsDark)
	const toggleTheme = useThemeStore((state) => state.toggleTheme)

	return { preference, isDark, toggleTheme }
}
