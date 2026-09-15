import * as stylex from '@stylexjs/stylex'
import { breakpoint } from '@shared/design/media.stylex'
import { colors, radius, shadow, space, text } from '@shared/design/tokens.stylex'
import { formatDelta } from '@shared/helpers/format'
import { formatKpiValue, getDeltaDirection, isDeltaGoodNews } from '../utils'
import type { Kpi } from '@/types'

export function KpiCard({ kpi }: { kpi: Kpi }) {
	const isGoodNews = isDeltaGoodNews(kpi.delta, kpi.higherIsBetter)
	const direction = getDeltaDirection(kpi.delta)

	return (
		<article data-testid="kpi-card" {...stylex.props(styles.card)}>
			<p {...stylex.props(styles.label)}>{kpi.label}</p>
			<p {...stylex.props(styles.value)}>{formatKpiValue(kpi)}</p>
			<p {...stylex.props(styles.footer)}>
				<span {...stylex.props(styles.delta, isGoodNews ? styles.good : styles.bad)}>
					<span aria-hidden>{direction === 'up' ? '▲' : '▼'}</span> {formatDelta(kpi.delta)}
				</span>
				<span {...stylex.props(styles.since)}>vs last month</span>
			</p>
		</article>
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
		padding: { default: space.lg, [breakpoint.sm]: space.xl },
	},
	label: { color: colors.muted, fontSize: text.body, margin: 0 },
	value: {
		fontSize: { default: '28px', [breakpoint.sm]: text.display },
		fontWeight: 700,
		letterSpacing: '-0.02em',
		lineHeight: 1.15,
		margin: 0,
		marginTop: space.xs,
	},
	footer: {
		alignItems: 'center',
		columnGap: space.sm,
		display: 'flex',
		flexWrap: 'wrap',
		fontSize: text.body,
		margin: 0,
		marginTop: space.sm,
	},
	delta: { fontWeight: 600 },
	good: { color: colors.positive },
	bad: { color: colors.danger },
	since: { color: colors.muted },
})
