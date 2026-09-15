import * as stylex from '@stylexjs/stylex'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { breakpoint } from '@shared/design/media.stylex'
import { colors, radius, shadow, space, text } from '@shared/design/tokens.stylex'
import { LoginForm } from '@auth/features/login-form/organisms/LoginForm'
import type { LoginFormValues } from '@auth/features/login-form/schemas'
import { useLogin } from '@auth/queries'
import { useAuthStore } from '@auth/stores/authStore'

export function LoginPage() {
	const navigate = useNavigate()
	const location = useLocation()
	const { t } = useTranslation()
	const session = useAuthStore((state) => state.session)
	const login = useLogin()
	const [rejectionMessage, setRejectionMessage] = useState<string | null>(null)

	// Already signed in: go where they were headed, or to the dashboard.
	if (session) {
		const intended = (location.state as { from?: string } | null)?.from ?? '/'
		return <Navigate to={intended} replace />
	}

	const handleSubmit = async (values: LoginFormValues) => {
		setRejectionMessage(null)
		try {
			await login.mutateAsync(values)
			const intended = (location.state as { from?: string } | null)?.from ?? '/'
			navigate(intended, { replace: true })
		} catch {
			// A 401 is an expected outcome of this form, not a fault to report.
			setRejectionMessage(t('login.rejected'))
		}
	}

	return (
		<div data-testid="login-page" {...stylex.props(styles.page)}>
			<div {...stylex.props(styles.column)}>
				<div {...stylex.props(styles.brand)}>
					<span aria-hidden {...stylex.props(styles.mark)} />
					<h1 {...stylex.props(styles.wordmark)}>{t('login.brand')}</h1>
				</div>

				<section {...stylex.props(styles.card)}>
					<h2 {...stylex.props(styles.title)}>{t('login.heading')}</h2>
					<p {...stylex.props(styles.subtitle)}>{t('login.subheading')}</p>

					<div {...stylex.props(styles.formSlot)}>
						<LoginForm
							isSubmitting={login.isPending}
							rejectionMessage={rejectionMessage}
							onSubmit={handleSubmit}
						/>
					</div>
				</section>
			</div>
		</div>
	)
}

const styles = stylex.create({
	page: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
		minHeight: '100%',
		paddingBlock: space.xxl,
		paddingInline: space.lg,
	},
	column: { maxWidth: '400px', width: '100%' },
	brand: { alignItems: 'center', display: 'flex', gap: space.md, justifyContent: 'center' },
	mark: { backgroundColor: colors.brand, borderRadius: radius.lg, height: '36px', width: '36px' },
	wordmark: { fontSize: text.title, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 },
	card: {
		backgroundColor: colors.surface,
		borderColor: colors.line,
		borderRadius: radius.xl,
		borderStyle: 'solid',
		borderWidth: '1px',
		boxShadow: shadow.card,
		marginTop: space.xxl,
		padding: { default: space.xl, [breakpoint.sm]: space.xxl },
	},
	title: { fontSize: text.subTitle, fontWeight: 700, margin: 0 },
	subtitle: { color: colors.muted, fontSize: text.body, margin: 0, marginTop: space.xs },
	formSlot: { marginTop: space.xl },
})
