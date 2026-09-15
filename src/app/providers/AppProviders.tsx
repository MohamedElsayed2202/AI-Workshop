import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

/**
 * The dashboard payload never changes during a session, so it is fetched once
 * and never refetched — which also lets the page reach network idle for the
 * screenshot run. Mutations invalidate their own keys explicitly.
 */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
})

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>{children}</BrowserRouter>
		</QueryClientProvider>
	)
}
