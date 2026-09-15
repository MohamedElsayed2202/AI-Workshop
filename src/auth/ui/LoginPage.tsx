import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '@auth/features/login-form/ui/LoginForm'
import { LOGIN_MESSAGES, type LoginFormValues } from '@auth/features/login-form/schemas'
import { useLogin } from '@auth/queries'
import { useAuthStore } from '@auth/stores/authStore'

export function LoginPage() {
	const navigate = useNavigate()
	const location = useLocation()
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
			setRejectionMessage(LOGIN_MESSAGES.rejected)
		}
	}

	return (
		<div data-testid="login-page" className="flex min-h-full items-center justify-center px-4 py-10">
			<div className="w-full max-w-[400px]">
				<div className="flex items-center justify-center gap-3">
					<span aria-hidden className="h-9 w-9 rounded-[10px] bg-brand" />
					<h1 className="text-[1.5rem] font-bold tracking-tight">PulseBoard</h1>
				</div>

				<section className="mt-6 rounded-xl border border-line bg-surface p-6 shadow-card">
					<h2 className="text-subTitle font-bold">Sign in</h2>
					<p className="mt-1 text-body text-muted">Use your PulseBoard account to continue.</p>

					<div className="mt-5">
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
