import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { dashboardQueryOptions } from '@dashboard/queries'
import { AccountsCard } from '@dashboard/features/accounts-table/ui/AccountsCard'
import { AccountDetailDrawer } from '@dashboard/features/account-detail/ui/AccountDetailDrawer'
import { KpiRow } from '@dashboard/features/kpis/ui/KpiRow'
import { RevenueChart } from '@dashboard/features/revenue-chart/ui/RevenueChart'
import type { Account } from '@/types'

export function DashboardPage() {
	const { data, isPending } = useQuery({ ...dashboardQueryOptions, placeholderData: keepPreviousData })
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

	if (isPending || !data) return <p className="py-10 text-center text-body text-muted">Loading dashboard…</p>

	return (
		<div className="flex flex-col gap-4 sm:gap-5">
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
