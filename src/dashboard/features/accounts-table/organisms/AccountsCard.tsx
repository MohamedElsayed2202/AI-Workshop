import * as stylex from '@stylexjs/stylex'
import { useTranslation } from 'react-i18next'
import { breakpoint } from '@shared/design/media.stylex'
import { Card, CardHeader, CardTitle } from '@shared/design-system/molecules/Card'
import { DataTable } from '@shared/design-system/molecules/DataTable'
import { EmptyState } from '@shared/design-system/molecules/EmptyState'
import { SortableHeader } from '@shared/design-system/molecules/SortableHeader'
import { colors, radius, space, text } from '@shared/design/tokens.stylex'
import { useAccountsTable } from '../hooks/useAccountsTable'
import { AccountRow } from '../molecules/AccountRow'
import type { Account } from '@/types'

interface AccountsCardProps {
	accounts: Account[]
	selectedAccountId: string | null
	onSelectAccount: (account: Account) => void
}

export function AccountsCard({ accounts, selectedAccountId, onSelectAccount }: AccountsCardProps) {
	const { t } = useTranslation()
	const { query, setQuery, sort, toggleSortBy, visibleAccounts, isEmpty } = useAccountsTable(accounts)

	const header = (
		<>
			<SortableHeader
				label={t('dashboard.accounts.columns.account')}
				sortKey="name"
				activeKey={sort?.key ?? null}
				direction={sort?.direction ?? null}
				onToggle={toggleSortBy}
			/>
			<SortableHeader
				label={t('dashboard.accounts.columns.plan')}
				sortKey="plan"
				activeKey={sort?.key ?? null}
				direction={sort?.direction ?? null}
				onToggle={toggleSortBy}
			/>
			<SortableHeader
				label={t('dashboard.accounts.columns.region')}
				sortKey="region"
				activeKey={sort?.key ?? null}
				direction={sort?.direction ?? null}
				onToggle={toggleSortBy}
			/>
			<SortableHeader
				label={t('dashboard.accounts.columns.owner')}
				sortKey="owner"
				activeKey={sort?.key ?? null}
				direction={sort?.direction ?? null}
				onToggle={toggleSortBy}
			/>
			<SortableHeader
				label={t('dashboard.accounts.columns.mrr')}
				sortKey="mrr"
				activeKey={sort?.key ?? null}
				direction={sort?.direction ?? null}
				onToggle={toggleSortBy}
				align="end"
			/>
			<SortableHeader
				label={t('dashboard.accounts.columns.seats')}
				sortKey="seats"
				activeKey={sort?.key ?? null}
				direction={sort?.direction ?? null}
				onToggle={toggleSortBy}
				align="end"
			/>
			<SortableHeader
				label={t('dashboard.accounts.columns.status')}
				sortKey="status"
				activeKey={sort?.key ?? null}
				direction={sort?.direction ?? null}
				onToggle={toggleSortBy}
			/>
			<SortableHeader
				label={t('dashboard.accounts.columns.health')}
				sortKey="health"
				activeKey={sort?.key ?? null}
				direction={sort?.direction ?? null}
				onToggle={toggleSortBy}
			/>
		</>
	)

	return (
		<Card>
			<CardHeader align="center">
				<CardTitle title={t('dashboard.accounts.title')} subtitle={t('dashboard.accounts.count', { count: accounts.length })} />
				<input
					data-testid="table-filter"
					type="text"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					aria-label={t('dashboard.accounts.filterLabel')}
					placeholder={t('dashboard.accounts.filterPlaceholder')}
					{...stylex.props(styles.filter)}
				/>
			</CardHeader>

			<DataTable
				testId="accounts-table"
				minWidth="820px"
				head={header}
				footer={isEmpty ? <EmptyState testId="table-empty" message={t('dashboard.accounts.empty')} /> : null}
			>
				{visibleAccounts.map((account) => (
					<AccountRow
						key={account.id}
						account={account}
						isSelected={account.id === selectedAccountId}
						onSelect={onSelectAccount}
					/>
				))}
			</DataTable>
		</Card>
	)
}

const styles = stylex.create({
	filter: {
		backgroundColor: colors.surface,
		borderColor: { default: colors.line, ':focus': colors.brand },
		borderRadius: radius.md,
		borderStyle: 'solid',
		borderWidth: '1px',
		color: colors.ink,
		fontSize: text.body,
		outline: 'none',
		paddingBlock: space.sm,
		paddingInline: space.md,
		width: { default: '100%', [breakpoint.sm]: '320px' },
	},
})
