import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { breakpoint } from '@shared/design/media.stylex'
import { colors, radius, shadow, space, text } from '@shared/design/tokens.stylex'

export function Card({ children }: { children: ReactNode }) {
	return <section {...stylex.props(styles.card)}>{children}</section>
}

export function CardHeader({ children, align = 'start' }: { children: ReactNode; align?: 'start' | 'center' }) {
	return <div {...stylex.props(styles.header, align === 'center' && styles.headerCentered)}>{children}</div>
}

export function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<div>
			<h2 {...stylex.props(styles.title)}>{title}</h2>
			{subtitle ? <p {...stylex.props(styles.subtitle)}>{subtitle}</p> : null}
		</div>
	)
}

const styles = stylex.create({
	card: {
		backgroundColor: colors.surface,
		borderColor: colors.line,
		borderRadius: radius.xl,
		borderStyle: 'solid',
		borderWidth: '1px',
		boxShadow: shadow.card,
		maxWidth: '100%',
		minWidth: 0,
	},
	header: {
		alignItems: 'flex-start',
		display: 'flex',
		flexWrap: 'wrap',
		gap: space.md,
		justifyContent: 'space-between',
		paddingInline: { default: space.lg, [breakpoint.sm]: space.xl },
		paddingTop: { default: space.lg, [breakpoint.sm]: space.xl },
	},
	headerCentered: { alignItems: { default: 'flex-start', [breakpoint.sm]: 'center' } },
	title: { fontSize: text.subTitle, fontWeight: 700, margin: 0 },
	subtitle: { color: colors.muted, fontSize: text.body, margin: 0, marginTop: '2px' },
})
