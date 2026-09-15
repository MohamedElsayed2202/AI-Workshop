import * as stylex from '@stylexjs/stylex'
import { NavLink, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { breakpoint } from '@shared/design/media.stylex'
import { LanguageToggle } from '@shared/design-system/molecules/LanguageToggle'
import { ThemeToggle } from '@shared/design-system/molecules/ThemeToggle'
import { colors, layout, radius, space, text } from '@shared/design/tokens.stylex'
import { SessionMenu } from '@auth/features/session/molecules/SessionMenu'
import { dashboardQueryOptions } from '@dashboard/queries'

/** "August 2026" (from data.json) -> the same month/year, spelled in the active language. */
function formatPeriodLabel(period: string, language: string): string {
	const parsed = new Date(period)
	if (Number.isNaN(parsed.getTime())) return period
	return new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric' }).format(parsed)
}

/**
 * The application chrome: the one <h1> in the document, the one navigation, and
 * the routed page. A second (mobile-only) nav would break the strict-mode
 * uniqueness of nav-dashboard / nav-users, so this one reflows instead.
 */
export function AppShell() {
	const { data } = useQuery(dashboardQueryOptions)
	const { t, i18n } = useTranslation()

	return (
		<div {...stylex.props(styles.root)}>
			<header {...stylex.props(styles.header)}>
				<div {...stylex.props(styles.headerInner)}>
					<div {...stylex.props(styles.brand)}>
						<span aria-hidden {...stylex.props(styles.mark)} />
						<h1 {...stylex.props(styles.wordmark)}>PulseBoard</h1>
					</div>

					<nav aria-label="Main" {...stylex.props(styles.nav)}>
						<ShellNavLink to="/" testId="nav-dashboard" label={t('nav.dashboard')} />
						<ShellNavLink to="/users" testId="nav-users" label={t('nav.users')} />
					</nav>

					<div {...stylex.props(styles.tools)}>
						{data ? (
							<p {...stylex.props(styles.meta)}>
								{formatPeriodLabel(data.meta.period, i18n.language)} · {t('dashboard.allRegions')}
							</p>
						) : null}
						<LanguageToggle />
						<ThemeToggle />
						<SessionMenu />
					</div>
				</div>
			</header>

			<main {...stylex.props(styles.main)}>
				<Outlet />
			</main>
		</div>
	)
}

function ShellNavLink({ to, testId, label }: { to: string; testId: string; label: string }) {
	return (
		<NavLink to={to} end data-testid={testId} {...stylex.props(styles.navLinkBase)}>
			{({ isActive }) => <span {...stylex.props(styles.navLink, isActive && styles.navLinkActive)}>{label}</span>}
		</NavLink>
	)
}

const styles = stylex.create({
	root: { minHeight: '100%' },
	header: {
		backgroundColor: colors.surface,
		borderBottomColor: colors.line,
		borderBottomStyle: 'solid',
		borderBottomWidth: '1px',
		position: 'sticky',
		top: 0,
		zIndex: 30,
	},
	headerInner: {
		alignItems: 'center',
		columnGap: space.xxl,
		display: 'flex',
		flexWrap: 'wrap',
		marginInline: 'auto',
		maxWidth: layout.maxWidth,
		paddingBlock: space.md,
		paddingInline: { default: space.lg, [breakpoint.sm]: space.xxl },
		rowGap: space.md,
	},
	brand: { alignItems: 'center', display: 'flex', gap: space.md },
	mark: { backgroundColor: colors.brand, borderRadius: radius.lg, height: '32px', width: '32px' },
	wordmark: { fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 },
	nav: { alignItems: 'center', display: 'flex', gap: space.xs },
	navLinkBase: { textDecoration: 'none' },
	navLink: {
		borderRadius: radius.md,
		color: { default: colors.muted, ':hover': colors.ink },
		display: 'inline-block',
		fontSize: text.subTitle,
		fontWeight: 500,
		paddingBlock: space.sm,
		paddingInline: space.md,
		transitionDuration: '150ms',
		transitionProperty: 'background-color, color',
	},
	navLinkActive: { backgroundColor: colors.brandTint, color: colors.brand },
	tools: { alignItems: 'center', display: 'flex', gap: space.md, marginInlineStart: 'auto' },
	meta: { color: colors.muted, display: { default: 'none', [breakpoint.sm]: 'block' }, fontSize: text.body, margin: 0 },
	main: {
		marginInline: 'auto',
		maxWidth: layout.maxWidth,
		paddingBlock: space.xl,
		paddingInline: { default: space.lg, [breakpoint.sm]: space.xxl },
	},
})
