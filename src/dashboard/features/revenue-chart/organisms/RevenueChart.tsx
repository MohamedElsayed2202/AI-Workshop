import * as stylex from '@stylexjs/stylex'
import { useRef } from 'react'
import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'
import { breakpoint } from '@shared/design/media.stylex'
import { Card, CardHeader, CardTitle } from '@shared/design-system/molecules/Card'
import { colors, radius, space, text } from '@shared/design/tokens.stylex'
import { formatCurrency, formatMonthLabel } from '@shared/helpers/format'
import { useElementWidth } from '@shared/hooks/useElementWidth'
import { buildAxisTicks, formatAxisTick, getAxisMaximum } from '../utils'
import type { RevenuePoint } from '@/types'

/** The chart shrinks in height across breakpoints; its type size stays legible. */
function getChartLayout(width: number) {
	if (width < 600) return { height: 190, fontSize: 9, axisWidth: 34, axisHeight: 22, margin: { top: 12, right: 6 } }
	if (width < 1280) return { height: 260, fontSize: 11, axisWidth: 46, axisHeight: 26, margin: { top: 14, right: 10 } }
	return { height: 300, fontSize: 12, axisWidth: 54, axisHeight: 30, margin: { top: 16, right: 12 } }
}

export function RevenueChart({ series }: { series: RevenuePoint[] }) {
	const { t } = useTranslation()
	const containerRef = useRef<HTMLDivElement>(null)
	const width = useElementWidth(containerRef)
	const { height, fontSize, axisWidth, axisHeight, margin } = getChartLayout(width)

	const maximum = getAxisMaximum(series)
	// StyleX variables are plain  strings at runtime, so Recharts can paint them.
	const tickStyle = { fontSize, fill: colors.muted }

	const first = series.at(0)
	const last = series.at(-1)
	const accessibleName = t('dashboard.revenueChart.accessibleName', {
		from: first ? formatMonthLabel(first.month) : '',
		to: last ? formatMonthLabel(last.month) : '',
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle title={t('dashboard.revenueChart.title')} subtitle={t('dashboard.revenueChart.subtitle')} />
			</CardHeader>

			<div {...stylex.props(styles.body)}>
				<ul {...stylex.props(styles.legend)}>
					<li {...stylex.props(styles.legendItem)}>
						<span aria-hidden {...stylex.props(styles.swatch, styles.revenueSwatch)} />
						{t('dashboard.revenueChart.revenue')}
					</li>
					<li {...stylex.props(styles.legendItem)}>
						<span aria-hidden {...stylex.props(styles.swatch, styles.targetSwatch)} />
						{t('dashboard.revenueChart.target')}
					</li>
				</ul>

				<div ref={containerRef} data-testid="revenue-chart" {...stylex.props(styles.chart)}>
					<ResponsiveContainer width="100%" height={height}>
						<ComposedChart
							data={series}
							margin={{ ...margin, bottom: 0, left: 0 }}
							barCategoryGap="28%"
							aria-label={accessibleName}
						>
							<CartesianGrid vertical={false} stroke={colors.line} />
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
								cursor={{ fill: colors.brandTint }}
								labelFormatter={(label) => formatMonthLabel(String(label))}
								formatter={(value, name) => [
									formatCurrency(Number(value)),
									name === 'revenue' ? t('dashboard.revenueChart.revenue') : t('dashboard.revenueChart.target'),
								]}
							/>
							<Bar dataKey="revenue" radius={[3, 3, 0, 0]} isAnimationActive={false}>
								{series.map((point, index) => (
									<Cell key={point.month} fill={index === series.length - 1 ? colors.brand : colors.brandSoft} />
								))}
							</Bar>
							<Line
								dataKey="target"
								stroke={colors.target}
								strokeWidth={2}
								isAnimationActive={false}
								dot={{ r: 3.5, fill: colors.surface, stroke: colors.target, strokeWidth: 2 }}
								activeDot={{ r: 4.5 }}
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>
		</Card>
	)
}

const styles = stylex.create({
	body: {
		paddingBottom: { default: space.lg, [breakpoint.sm]: space.xl },
		paddingInline: { default: space.lg, [breakpoint.sm]: space.xl },
	},
	legend: {
		alignItems: 'center',
		color: colors.muted,
		display: 'flex',
		fontSize: text.body,
		gap: space.lg,
		listStyle: 'none',
		margin: 0,
		marginTop: space.md,
		padding: 0,
	},
	legendItem: { alignItems: 'center', display: 'flex', gap: space.sm },
	swatch: { height: '10px', width: '10px' },
	revenueSwatch: { backgroundColor: colors.brand, borderRadius: radius.sm },
	targetSwatch: { backgroundColor: colors.target, borderRadius: radius.pill },
	chart: { marginTop: space.sm, width: '100%' },
})
