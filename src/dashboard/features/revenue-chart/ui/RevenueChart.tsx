import { useRef } from 'react'
import { Card, CardHeader, CardTitle } from '@shared/components/ui/Card'
import { useElementWidth } from '@shared/hooks/useElementWidth'
import { formatMonthLabel } from '@shared/helpers/format'
import { buildChartGeometry, toPolyline } from '../utils'
import type { RevenuePoint } from '@/types'

/** Breakpoints mirror the Tailwind scale; the chart shrinks in height, not in type size. */
function getChartLayout(width: number) {
	if (width < 600) return { height: 190, fontSize: 9, padding: { top: 12, right: 6, bottom: 22, left: 34 } }
	if (width < 1280) return { height: 260, fontSize: 11, padding: { top: 14, right: 10, bottom: 26, left: 46 } }
	return { height: 300, fontSize: 12, padding: { top: 16, right: 12, bottom: 30, left: 54 } }
}

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
	const containerRef = useRef<HTMLDivElement>(null)
	const width = useElementWidth(containerRef)
	const { height, fontSize, padding } = getChartLayout(width)
	const { bars, targetPoints, ticks, plot } = buildChartGeometry(series, { width, height }, padding)

	const first = series.at(0)
	const last = series.at(-1)
	const accessibleName = `Revenue versus target, ${first ? formatMonthLabel(first.month) : ''} to ${
		last ? formatMonthLabel(last.month) : ''
	}, monthly recurring revenue`

	return (
		<Card>
			<CardHeader>
				<CardTitle title="Revenue vs target" subtitle="Monthly recurring revenue, last 12 months" />
			</CardHeader>

			<div className="px-4 pb-4 sm:px-5 sm:pb-5">
				<ul className="mt-3 flex items-center gap-4 text-body text-muted">
					<li className="flex items-center gap-2">
						<span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-brand" />
						Revenue
					</li>
					<li className="flex items-center gap-2">
						<span aria-hidden className="h-2.5 w-2.5 rounded-full bg-target" />
						Target
					</li>
				</ul>

				<div ref={containerRef} data-testid="revenue-chart" className="mt-2 w-full">
					<svg role="img" aria-label={accessibleName} width={width} height={height} className="block">
						{ticks.map((tick) => (
							<g key={tick.value}>
								<line x1={plot.left} x2={plot.right} y1={tick.y} y2={tick.y} stroke="var(--pb-line)" strokeWidth={1} />
								<text
									x={plot.left - 8}
									y={tick.y + fontSize / 3}
									textAnchor="end"
									fontSize={fontSize}
									fill="var(--pb-muted)"
								>
									{tick.label}
								</text>
							</g>
						))}

						{bars.map((bar) => (
							<rect
								key={bar.month}
								x={bar.x}
								y={bar.y}
								width={bar.width}
								height={bar.height}
								rx={3}
								fill={bar.isLatest ? 'var(--pb-brand)' : 'var(--pb-brand-soft)'}
							/>
						))}

						<polyline points={toPolyline(targetPoints)} fill="none" stroke="var(--pb-target)" strokeWidth={2} />
						{targetPoints.map((point, index) => (
							<circle
								key={series[index]?.month ?? index}
								cx={point.x}
								cy={point.y}
								r={3.5}
								fill="var(--pb-surface)"
								stroke="var(--pb-target)"
								strokeWidth={2}
							/>
						))}

						{bars.map((bar) => (
							<text
								key={`label-${bar.month}`}
								x={bar.x + bar.width / 2}
								y={plot.bottom + fontSize + 8}
								textAnchor="middle"
								fontSize={fontSize}
								fill="var(--pb-muted)"
							>
								{formatMonthLabel(bar.month)}
							</text>
						))}
					</svg>
				</div>
			</div>
		</Card>
	)
}
