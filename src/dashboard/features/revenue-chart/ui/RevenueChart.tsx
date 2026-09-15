import { useRef } from 'react'
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader, CardTitle } from '@shared/components/ui/Card'
import { useElementWidth } from '@shared/hooks/useElementWidth'
import { formatCurrency, formatMonthLabel } from '@shared/helpers/format'
import { buildAxisTicks, formatAxisTick, getAxisMaximum } from '../utils'
import type { RevenuePoint } from '@/types'

/** Breakpoints mirror the Tailwind scale; the chart shrinks in height, not in type size. */
function getChartLayout(width: number) {
	if (width < 600) return { height: 190, fontSize: 9, axisWidth: 34, axisHeight: 22, margin: { top: 12, right: 6 } }
	if (width < 1280) return { height: 260, fontSize: 11, axisWidth: 46, axisHeight: 26, margin: { top: 14, right: 10 } }
	return { height: 300, fontSize: 12, axisWidth: 54, axisHeight: 30, margin: { top: 16, right: 12 } }
}

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
	const containerRef = useRef<HTMLDivElement>(null)
	const width = useElementWidth(containerRef)
	const { height, fontSize, axisWidth, axisHeight, margin } = getChartLayout(width)

	const maximum = getAxisMaximum(series)
	const tickStyle = { fontSize, fill: 'var(--pb-muted)' }

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
					<ResponsiveContainer width="100%" height={height}>
						<ComposedChart data={series} margin={{ ...margin, bottom: 0, left: 0 }} barCategoryGap="38%" aria-label={accessibleName}>
							<CartesianGrid vertical={false} stroke="var(--pb-line)" />
							<XAxis
								dataKey="month"
								height={axisHeight}
								tickFormatter={formatMonthLabel}
								tick={tickStyle}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								width={axisWidth}
								domain={[0, maximum]}
								ticks={buildAxisTicks(maximum)}
								tickFormatter={formatAxisTick}
								tick={tickStyle}
								tickLine={false}
								axisLine={false}
							/>
							<Tooltip
								cursor={{ fill: 'var(--pb-brand-tint)' }}
								labelFormatter={(label) => formatMonthLabel(String(label))}
								formatter={(value, name) => [formatCurrency(Number(value)), name === 'revenue' ? 'Revenue' : 'Target']}
							/>
							<Bar dataKey="revenue" radius={[3, 3, 0, 0]} isAnimationActive={false}>
								{series.map((point, index) => (
									<Cell
										key={point.month}
										fill={index === series.length - 1 ? 'var(--pb-brand)' : 'var(--pb-brand-soft)'}
									/>
								))}
							</Bar>
							<Line
								dataKey="target"
								stroke="var(--pb-target)"
								strokeWidth={2}
								isAnimationActive={false}
								dot={{ r: 3.5, fill: 'var(--pb-surface)', stroke: 'var(--pb-target)', strokeWidth: 2 }}
								activeDot={{ r: 4.5 }}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>
		</Card>
	)
}
