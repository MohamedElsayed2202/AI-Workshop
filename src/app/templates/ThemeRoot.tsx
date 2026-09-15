import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { darkTheme, lightTheme } from '@shared/design/themes.stylex'
import { colors } from '@shared/design/tokens.stylex'
import { useTheme } from '@shared/hooks/useTheme'

/**
 * Applies the explicit theme choice and paints the page background. Every
 * overlay lives inside this subtree — native <dialog> included — so they all
 * inherit the same variables.
 */
export function ThemeRoot({ children }: { children: ReactNode }) {
	const { preference } = useTheme()

	return (
		<div
			{...stylex.props(
				styles.root,
				preference === 'light' && lightTheme,
				preference === 'dark' && darkTheme,
			)}
		>
			{children}
		</div>
	)
}

const styles = stylex.create({
	root: {
		backgroundColor: colors.page,
		color: colors.ink,
		minHeight: '100%',
	},
})
