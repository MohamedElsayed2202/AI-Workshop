import * as stylex from '@stylexjs/stylex'
import { colors, radius, space } from '@shared/design/tokens.stylex'

/** A 0-100 account health score as a track, a bar and the number. */
export function HealthBar({ score }: { score: number }) {
	const tone = score >= 70 ? styles.good : score >= 50 ? styles.fair : styles.poor
	const width = `${Math.min(100, Math.max(0, score))}%`

	return (
		<span {...stylex.props(styles.wrapper)}>
			<span {...stylex.props(styles.track)}>
				<span {...stylex.props(styles.fill, tone)} style={{ width }} />
			</span>
			<span {...stylex.props(styles.value)}>{score}</span>
		</span>
	)
}

const styles = stylex.create({
	wrapper: { alignItems: 'center', display: 'flex', gap: space.sm },
	track: {
		backgroundColor: colors.neutralSoft,
		borderRadius: radius.pill,
		display: 'block',
		flexShrink: 0,
		height: '6px',
		overflow: 'hidden',
		width: '64px',
	},
	fill: { borderRadius: radius.pill, display: 'block', height: '100%' },
	good: { backgroundColor: colors.positive },
	fair: { backgroundColor: colors.warn },
	poor: { backgroundColor: colors.danger },
	value: { fontVariantNumeric: 'tabular-nums' },
})
