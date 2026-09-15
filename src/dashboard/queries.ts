import { queryOptions } from '@tanstack/react-query'
import { httpClient } from '@shared/api/httpClient'
import type { Account, DashboardData, Kpi, RevenuePoint } from '@/types'

export interface DashboardPayload {
	meta: DashboardData['meta']
	kpis: Kpi[]
	revenueSeries: RevenuePoint[]
	accounts: Account[]
}

export const dashboardQueryOptions = queryOptions({
	queryKey: ['dashboard'] as const,
	queryFn: () => httpClient.get<DashboardPayload>('/dashboard'),
})
