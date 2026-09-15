import { Card, CardHeader, CardTitle } from '@shared/components/ui/Card'
import { useAccountsTable } from '../hooks/useAccountsTable'
import { AccountRow } from './AccountRow'
import { SortableHeader } from './SortableHeader'
import type { Account } from '@/types'

interface AccountsCardProps {
	accounts: Account[]
	selectedAccountId: string | null
	onSelectAccount: (account: Account) => void
}

export function AccountsCard({ accounts, selectedAccountId, onSelectAccount }: AccountsCardProps) {
	const { query, setQuery, sort, toggleSortBy, visibleAccounts, isEmpty } = useAccountsTable(accounts)

	return (
		<Card>
			<CardHeader className="sm:items-center">
				<CardTitle title="Accounts" subtitle={`${accounts.length} accounts`} />
				<input
					data-testid="table-filter"
					type="text"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					aria-label="Filter accounts"
					placeholder="Filter by name, owner, plan, region, status…"
					className="w-full rounded-lg border border-line px-3 py-2 text-body outline-none placeholder:text-muted focus:border-brand sm:w-[320px]"
				/>
			</CardHeader>

			<div className="mt-4 min-w-0 max-w-full overflow-x-auto px-4 pb-4 sm:px-5 sm:pb-5">
				<table data-testid="accounts-table" className="w-full min-w-[820px] border-collapse text-body">
					<thead>
						<tr className="text-muted">
							<SortableHeader label="Account" sortKey="name" sort={sort} onToggle={toggleSortBy} />
							<SortableHeader label="Plan" sortKey="plan" sort={sort} onToggle={toggleSortBy} />
							<SortableHeader label="Region" sortKey="region" sort={sort} onToggle={toggleSortBy} />
							<SortableHeader label="Owner" sortKey="owner" sort={sort} onToggle={toggleSortBy} />
							<SortableHeader label="MRR" sortKey="mrr" sort={sort} onToggle={toggleSortBy} align="right" />
							<SortableHeader label="Seats" sortKey="seats" sort={sort} onToggle={toggleSortBy} align="right" />
							<SortableHeader label="Status" sortKey="status" sort={sort} onToggle={toggleSortBy} />
							<SortableHeader label="Health" sortKey="health" sort={sort} onToggle={toggleSortBy} />
						</tr>
					</thead>
					<tbody>
						{visibleAccounts.map((account) => (
							<AccountRow
								key={account.id}
								account={account}
								isSelected={account.id === selectedAccountId}
								onSelect={onSelectAccount}
							/>
						))}
					</tbody>
				</table>

				{isEmpty ? (
					<p data-testid="table-empty" className="px-3 py-10 text-center text-body text-muted">
						No accounts match that filter.
					</p>
				) : null}
			</div>
		</Card>
	)
}
