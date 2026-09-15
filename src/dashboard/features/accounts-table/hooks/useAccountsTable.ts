import { useMemo, useState } from 'react'
import { filterAccounts, sortAccounts, toggleSort, type AccountSort, type AccountSortKey } from '../utils'
import type { Account } from '@/types'

/**
 * All accounts-table behaviour lives here, so the table components stay purely
 * presentational. Moving this state into the URL (nuqs) is a change to this
 * file alone.
 */
export function useAccountsTable(accounts: Account[]) {
	const [query, setQuery] = useState('')
	const [sort, setSort] = useState<AccountSort | null>(null)

	const visibleAccounts = useMemo(() => sortAccounts(filterAccounts(accounts, query), sort), [accounts, query, sort])

	return {
		query,
		setQuery,
		sort,
		toggleSortBy: (key: AccountSortKey) => setSort((current) => toggleSort(current, key)),
		visibleAccounts,
		isEmpty: visibleAccounts.length === 0,
	}
}
