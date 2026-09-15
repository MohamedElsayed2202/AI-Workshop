import { AppProviders } from '@/app/providers/AppProviders'
import { AppRoutes } from '@/app/router/routes'
import { ThemeRoot } from '@/app/templates/ThemeRoot'

export default function App() {
	return (
		<AppProviders>
			<ThemeRoot>
				<AppRoutes />
			</ThemeRoot>
		</AppProviders>
	)
}
