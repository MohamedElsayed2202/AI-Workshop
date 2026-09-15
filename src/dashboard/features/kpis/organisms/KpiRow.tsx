import * as stylex from '@stylexjs/stylex'
import { breakpoint } from '@shared/design/media.stylex'
import { space } from '@shared/design/tokens.stylex'
import { KpiCard } from '../molecules/KpiCard'
import type { Kpi } from '@/types'

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
	return (
		<div data-testid="kpi-row" {...stylex.props(styles.row)}>
			{kpis.map((kpi) => (
				<KpiCard key={kpi.id} kpi={kpi} />
			))}
		</div>
	)
}

const styles = stylex.create({
	row: {
		display: 'grid',
		gap: { default: space.md, [breakpoint.sm]: space.lg },
		gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', [breakpoint.lg]: 'repeat(4, minmax(0, 1fr))' },
	},
})
