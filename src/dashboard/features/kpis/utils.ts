import { match } from 'ts-pattern'
import { formatCurrency, formatNumber, formatPercent } from '@shared/helpers/format'
import type { Kpi } from '@/types'

/** A KPI's headline value, formatted per its declared format. */
export function formatKpiValue(kpi: Kpi): string {
	return match(kpi.format)
		.with('currency', () => formatCurrency(kpi.value))
		.with('number', () => formatNumber(kpi.value))
		.with('percent', () => formatPercent(kpi.value))
		.with('score', () => formatNumber(kpi.value))
		.exhaustive()
}

/**
 * Direction and sentiment are independent: churn falling is a green down-arrow.
 * The arrow follows the sign, the colour follows whether that sign is good news.
 */
export function getDeltaDirection(delta: number): 'up' | 'down' {
	return delta >= 0 ? 'up' : 'down'
}

export function isDeltaGoodNews(delta: number, higherIsBetter: boolean): boolean {
	return delta >= 0 === higherIsBetter
}
