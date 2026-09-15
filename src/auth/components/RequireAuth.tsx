import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { appConfig } from '@/app/config'
import { useAuthStore } from '@auth/stores/authStore'

/**
 * Route guard. When the gate is disabled the app is wide open, which is how the
 * acceptance suite — and a quick local preview — expect it to behave.
 */
export function RequireAuth() {
	const location = useLocation()
	const session = useAuthStore((state) => state.session)

	if (!appConfig.authEnabled || session) return <Outlet />

	return <Navigate to="/login" replace state={{ from: location.pathname }} />
}
