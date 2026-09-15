import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { RequireAuth } from '@auth/components/RequireAuth'
import { LoginPage } from '@auth/ui/LoginPage'
import { DashboardPage } from '@dashboard/ui/DashboardPage'
import { UsersPage } from '@users/ui/UsersPage'

export function AppRoutes() {
	return (
		<Routes>
			<Route path="login" element={<LoginPage />} />

			<Route element={<RequireAuth />}>
				<Route element={<AppShell />}>
					<Route index element={<DashboardPage />} />
					<Route path="users" element={<UsersPage />} />
				</Route>
			</Route>
		</Routes>
	)
}
