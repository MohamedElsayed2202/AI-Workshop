import * as stylex from '@stylexjs/stylex'
import { match } from 'ts-pattern'
import { colors, radius, space, text } from '@shared/design/tokens.stylex'

export type BadgeTone = 'positive' | 'brand' | 'warn' | 'danger' | 'neutral'

/** A tinted status pill. Domain meaning is decided by the caller, not here. */
export function Badge({ tone, children }: { tone: BadgeTone; children: string }) {
	const toneStyle = match(tone)
		.with('positive', () => styles.positive)
		.with('brand', () => styles.brand)
		.with('warn', () => styles.warn)
		.with('danger', () => styles.danger)
		.with('neutral', () => styles.neutral)
		.exhaustive()

	return <span {...stylex.props(styles.pill, toneStyle)}>{children}</span>
}

const styles = stylex.create({
	pill: {
		borderRadius: radius.pill,
		display: 'inline-flex',
		fontSize: text.label,
		fontWeight: 600,
		paddingBlock: space.xs,
		paddingInline: space.sm,
		whiteSpace: 'nowrap',
	},
	positive: { backgroundColor: colors.positiveSoft, color: colors.positive },
	brand: { backgroundColor: colors.brandTint, color: colors.brand },
	warn: { backgroundColor: colors.warnSoft, color: colors.warn },
	danger: { backgroundColor: colors.dangerSoft, color: colors.danger },
	neutral: { backgroundColor: colors.neutralSoft, color: colors.muted },
})
