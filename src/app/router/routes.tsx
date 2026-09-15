import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/templates/AppShell'
import { RequireAuth } from '@auth/components/RequireAuth'
import { LoginPage } from '@auth/pages/LoginPage'
import { DashboardPage } from '@dashboard/pages/DashboardPage'
import { UsersPage } from '@users/pages/UsersPage'

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
