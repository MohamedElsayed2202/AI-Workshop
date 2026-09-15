import { NavLink, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { dashboardQueryOptions } from '@dashboard/queries'
import { ThemeToggle } from '@shared/components/ui/ThemeToggle'
import { cn } from '@shared/helpers/cn'

/**
 * The application chrome: the one <h1> in the document, the one navigation, and
 * the routed page. Rendering a second (mobile-only) nav would break Playwright's
 * strict-mode uniqueness on nav-dashboard / nav-users, so this nav reflows instead.
 */
export function AppShell() {
	const { data } = useQuery(dashboardQueryOptions)

	return (
		<div className="min-h-full">
			<header className="sticky top-0 z-30 border-b border-line bg-surface">
				<div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
					<div className="flex items-center gap-3">
						<span aria-hidden className="h-8 w-8 rounded-[10px] bg-brand" />
						<h1 className="text-[1.375rem] font-bold tracking-tight">PulseBoard</h1>
					</div>

					<nav aria-label="Main" className="flex items-center gap-1">
						<ShellNavLink to="/" testId="nav-dashboard" label="Dashboard" />
						<ShellNavLink to="/users" testId="nav-users" label="Users" />
					</nav>

					<div className="ml-auto flex items-center gap-3">
						{data ? <p className="hidden text-body text-muted sm:block">{data.meta.period} · all regions</p> : null}
						<ThemeToggle />
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6">
				<Outlet />
			</main>
		</div>
	)
}

function ShellNavLink({ to, testId, label }: { to: string; testId: string; label: string }) {
	return (
		<NavLink
			to={to}
			end
			data-testid={testId}
			className={({ isActive }) =>
				cn(
					'rounded-lg px-3 py-1.5 text-subTitle font-medium transition-colors',
					isActive ? 'bg-brand-tint text-brand' : 'text-muted hover:text-ink',
				)
			}
		>
			{label}
		</NavLink>
	)
}
