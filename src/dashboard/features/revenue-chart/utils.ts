import type { RevenuePoint } from '@/types'

export interface ChartBar {
	month: string
	x: number
	y: number
	width: number
	height: number
	isLatest: boolean
}

export interface ChartPoint {
	x: number
	y: number
}

export interface ChartTick {
	value: number
	y: number
	label: string
}

export interface ChartGeometry {
	bars: ChartBar[]
	targetPoints: ChartPoint[]
	ticks: ChartTick[]
	plot: { left: number; right: number; top: number; bottom: number }
}

/** Rounds the axis maximum up to a clean $25k step, as the design does. */
export function getAxisMaximum(series: RevenuePoint[]): number {
	const peak = series.reduce((max, point) => Math.max(max, point.revenue, point.target), 0)
	const step = 25_000
	return Math.max(step, Math.ceil(peak / step) * step)
}

/**
 * Geometry in real pixels, so the chart is drawn 1:1 and its labels stay the
 * same size at every viewport.
 */
export function buildChartGeometry(
	series: RevenuePoint[],
	size: { width: number; height: number },
	padding: { top: number; right: number; bottom: number; left: number },
): ChartGeometry {
	const plot = {
		left: padding.left,
		right: size.width - padding.right,
		top: padding.top,
		bottom: size.height - padding.bottom,
	}
	const plotWidth = Math.max(0, plot.right - plot.left)
	const plotHeight = Math.max(0, plot.bottom - plot.top)
	const maximum = getAxisMaximum(series)

	const slotWidth = plotWidth / Math.max(1, series.length)
	const barWidth = Math.max(2, slotWidth * 0.62)
	const toY = (value: number) => plot.bottom - (value / maximum) * plotHeight

	const bars = series.map((point, index) => {
		const y = toY(point.revenue)
		return {
			month: point.month,
			x: plot.left + index * slotWidth + (slotWidth - barWidth) / 2,
			y,
			width: barWidth,
			height: Math.max(0, plot.bottom - y),
			isLatest: index === series.length - 1,
		}
	})

	const targetPoints = series.map((point, index) => ({
		x: plot.left + index * slotWidth + slotWidth / 2,
		y: toY(point.target),
	}))

	const ticks = Array.from({ length: maximum / 25_000 + 1 }, (_, index) => {
		const value = index * 25_000
		return { value, y: toY(value), label: value === 0 ? '0' : `$${value / 1000}k` }
	})

	return { bars, targetPoints, ticks, plot }
}

export function toPolyline(points: ChartPoint[]): string {
	return points.map((point) => `${point.x},${point.y}`).join(' ')
}
