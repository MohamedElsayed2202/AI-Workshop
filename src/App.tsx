import { AppProviders } from '@/app/providers/AppProviders'
import { AppRoutes } from '@/app/router/routes'

export default function App() {
	return (
		<AppProviders>
			<AppRoutes />
		</AppProviders>
	)
}
