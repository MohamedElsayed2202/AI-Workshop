import type { RevenuePoint } from '@/types'

const AXIS_STEP = 25_000

/** Rounds the axis maximum up to a clean $25k step, as the design does. */
export function getAxisMaximum(series: RevenuePoint[]): number {
	const peak = series.reduce((max, point) => Math.max(max, point.revenue, point.target), 0)
	return Math.max(AXIS_STEP, Math.ceil(peak / AXIS_STEP) * AXIS_STEP)
}

/** Explicit $25k gridlines, so Recharts does not pick its own tick count. */
export function buildAxisTicks(maximum: number): number[] {
	return Array.from({ length: maximum / AXIS_STEP + 1 }, (_, index) => index * AXIS_STEP)
}

/** 0 -> "0", 75000 -> "$75k". */
export function formatAxisTick(value: number): string {
	return value === 0 ? '0' : `$${value / 1000}k`
}
