import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'

/**
 * Hides content visually while leaving it for assistive technology. Position is
 * relative so the element cannot escape a scroll container and widen the page.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
	return <span {...stylex.props(styles.hidden)}>{children}</span>
}

const styles = stylex.create({
	hidden: {
		border: 0,
		clipPath: 'inset(50%)',
		height: '1px',
		overflow: 'hidden',
		padding: 0,
		position: 'relative',
		whiteSpace: 'nowrap',
		width: '1px',
	},
})
