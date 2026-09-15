import { KpiCard } from './KpiCard'
import type { Kpi } from '@/types'

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
	return (
		<div data-testid="kpi-row" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			{kpis.map((kpi) => (
				<KpiCard key={kpi.id} kpi={kpi} />
			))}
		</div>
	)
}
