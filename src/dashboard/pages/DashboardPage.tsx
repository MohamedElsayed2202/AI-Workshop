import * as stylex from '@stylexjs/stylex'
import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { breakpoint } from '@shared/design/media.stylex'
import { colors, space, text } from '@shared/design/tokens.stylex'
import { dashboardQueryOptions } from '@dashboard/queries'
import { AccountDetailDrawer } from '@dashboard/features/account-detail/organisms/AccountDetailDrawer'
import { AccountsCard } from '@dashboard/features/accounts-table/organisms/AccountsCard'
import { KpiRow } from '@dashboard/features/kpis/organisms/KpiRow'
import { RevenueChart } from '@dashboard/features/revenue-chart/organisms/RevenueChart'
import type { Account } from '@/types'

export function DashboardPage() {
	const { data, isPending } = useQuery({ ...dashboardQueryOptions, placeholderData: keepPreviousData })
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

	if (isPending || !data) return <p {...stylex.props(styles.loading)}>Loading dashboard…</p>

	return (
		<div {...stylex.props(styles.page)}>
			<KpiRow kpis={data.kpis} />
			<RevenueChart series={data.revenueSeries} />
			<AccountsCard
				accounts={data.accounts}
				selectedAccountId={selectedAccount?.id ?? null}
				onSelectAccount={setSelectedAccount}
			/>

			{selectedAccount ? (
				<AccountDetailDrawer account={selectedAccount} onClose={() => setSelectedAccount(null)} />
			) : null}
		</div>
	)
}

const styles = stylex.create({
	page: {
		display: 'flex',
		flexDirection: 'column',
		gap: { default: space.lg, [breakpoint.sm]: space.xl },
		minWidth: 0,
	},
	loading: { color: colors.muted, fontSize: text.body, paddingBlock: space.xxl, textAlign: 'center' },
})
