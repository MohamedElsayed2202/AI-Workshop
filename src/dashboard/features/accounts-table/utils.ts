import type { Account } from '@/types'

export type AccountSortKey = 'name' | 'plan' | 'region' | 'owner' | 'mrr' | 'seats' | 'status' | 'health'
export type SortDirection = 'asc' | 'desc'

export interface AccountSort {
	key: AccountSortKey
	direction: SortDirection
}

/**
 * The filter searches exactly these five fields — deliberately not ownerEmail
 * or notes, so "Orion" matches the Orion Health row and not the unrelated
 * account whose notes mention it.
 */
const SEARCHABLE_FIELDS = ['name', 'owner', 'plan', 'region', 'status'] as const

export function matchesQuery(account: Account, query: string): boolean {
	const needle = query.trim().toLowerCase()
	if (!needle) return true
	return SEARCHABLE_FIELDS.some((field) => account[field].toLowerCase().includes(needle))
}

export function filterAccounts(accounts: Account[], query: string): Account[] {
	return accounts.filter((account) => matchesQuery(account, query))
}

export function sortAccounts(accounts: Account[], sort: AccountSort | null): Account[] {
	if (!sort) return accounts

	const multiplier = sort.direction === 'asc' ? 1 : -1
	return [...accounts].sort((left, right) => {
		const leftValue = left[sort.key]
		const rightValue = right[sort.key]

		if (typeof leftValue === 'number' && typeof rightValue === 'number') {
			return (leftValue - rightValue) * multiplier
		}
		return String(leftValue).localeCompare(String(rightValue)) * multiplier
	})
}

/** First click sorts ascending; clicking the active column flips the direction. */
export function toggleSort(current: AccountSort | null, key: AccountSortKey): AccountSort {
	if (current?.key !== key) return { key, direction: 'asc' }
	return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
}
