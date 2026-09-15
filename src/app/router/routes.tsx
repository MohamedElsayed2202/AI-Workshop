import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { DashboardPage } from '@dashboard/ui/DashboardPage'
import { UsersPage } from '@users/ui/UsersPage'

export function AppRoutes() {
	return (
		<Routes>
			<Route element={<AppShell />}>
				<Route index element={<DashboardPage />} />
				<Route path="users" element={<UsersPage />} />
			</Route>
		</Routes>
	)
}
