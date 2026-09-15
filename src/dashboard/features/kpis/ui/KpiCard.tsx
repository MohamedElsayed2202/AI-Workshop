import { cn } from '@shared/helpers/cn'
import { formatDelta } from '@shared/helpers/format'
import { formatKpiValue, getDeltaDirection, isDeltaGoodNews } from '../utils'
import type { Kpi } from '@/types'

export function KpiCard({ kpi }: { kpi: Kpi }) {
	const isGoodNews = isDeltaGoodNews(kpi.delta, kpi.higherIsBetter)
	const direction = getDeltaDirection(kpi.delta)

	return (
		<article data-testid="kpi-card" className="rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5">
			<p className="text-body text-muted">{kpi.label}</p>
			<p className="mt-1 text-[1.75rem] font-bold leading-tight tracking-tight sm:text-[1.875rem]">{formatKpiValue(kpi)}</p>
			<p className="mt-2 flex flex-wrap items-center gap-x-2 text-body">
				<span className={cn('font-semibold', isGoodNews ? 'text-positive' : 'text-danger')}>
					<span aria-hidden>{direction === 'up' ? '▲' : '▼'}</span> {formatDelta(kpi.delta)}
				</span>
				<span className="text-muted">vs last month</span>
			</p>
		</article>
	)
}
