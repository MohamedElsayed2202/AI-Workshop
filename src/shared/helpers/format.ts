/**
 * Every user-facing number in PulseBoard is formatted here. The acceptance
 * contract pins these exactly: "$85,370", "3.2%", "+5.5%" / "-0.4%".
 */

/** Whole-dollar currency, no cents: 85370 -> "$85,370". */
export function formatCurrency(amount: number): string {
	return `$${Math.round(amount).toLocaleString('en-US')}`
}

/** Plain integer count: 15 -> "15". */
export function formatNumber(value: number): string {
	return Math.round(value).toLocaleString('en-US')
}

/** A rate held as a fraction: 0.032 -> "3.2%". */
export function formatPercent(fraction: number): string {
	return `${(fraction * 100).toFixed(1)}%`
}

/** A signed change: 0.055 -> "+5.5%", -0.004 -> "-0.4%". */
export function formatDelta(fraction: number): string {
	const sign = fraction >= 0 ? '+' : '-'
	return `${sign}${(Math.abs(fraction) * 100).toFixed(1)}%`
}

/** "2026-08-31" or an ISO datetime -> "Aug 31, 2026". */
export function formatDate(isoDate: string | null): string {
	if (!isoDate) return '—'
	const parsed = new Date(isoDate)
	if (Number.isNaN(parsed.getTime())) return '—'
	return parsed.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	})
}

/** "2025-09" -> "Sep", for the revenue chart axis. */
export function formatMonthLabel(isoMonth: string): string {
	const [year, month] = isoMonth.split('-')
	const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, 1))
	return parsed.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
}

/** "Priya Raman" -> "PR", for the users table avatar. */
export function toInitials(fullName: string): string {
	return fullName
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('')
}
