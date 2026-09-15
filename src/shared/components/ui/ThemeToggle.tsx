import { useTheme } from '@shared/hooks/useTheme'

export function ThemeToggle() {
	const { isDark, toggleTheme } = useTheme()

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-pressed={isDark}
			aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
			title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
			className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-body text-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
		>
			<span aria-hidden>{isDark ? '☀' : '☾'}</span>
		</button>
	)
}
