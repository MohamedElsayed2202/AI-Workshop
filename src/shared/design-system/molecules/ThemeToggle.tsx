import * as stylex from '@stylexjs/stylex'
import { colors, radius, text } from '@shared/design/tokens.stylex'
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
			{...stylex.props(styles.toggle)}
		>
			<span aria-hidden>{isDark ? '☀' : '☾'}</span>
		</button>
	)
}

const styles = stylex.create({
	toggle: {
		alignItems: 'center',
		backgroundColor: { default: colors.surface, ':hover': colors.hover },
		borderColor: colors.line,
		borderRadius: radius.md,
		borderStyle: 'solid',
		borderWidth: '1px',
		color: { default: colors.muted, ':hover': colors.ink },
		cursor: 'pointer',
		display: 'flex',
		flexShrink: 0,
		fontSize: text.body,
		height: '40px',
		justifyContent: 'center',
		width: '40px',
		outline: { default: 'none', ':focus-visible': `2px solid ${colors.brand}` },
		outlineOffset: '2px',
	},
})
