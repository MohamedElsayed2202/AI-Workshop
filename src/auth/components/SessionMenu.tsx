import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/components/ui/Button'
import { toInitials } from '@shared/helpers/format'
import { useAuthStore } from '@auth/stores/authStore'

/**
 * Renders nothing when nobody is signed in — which is every render while the
 * auth gate is disabled, so the header is unchanged in that mode.
 */
export function SessionMenu() {
	const navigate = useNavigate()
	const session = useAuthStore((state) => state.session)
	const signOut = useAuthStore((state) => state.signOut)

	if (!session) return null

	const handleSignOut = () => {
		signOut()
		navigate('/login', { replace: true })
	}

	return (
		<div className="flex items-center gap-2">
			<span
				aria-hidden
				className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint text-label font-bold text-brand"
			>
				{toInitials(session.username)}
			</span>
			<span className="hidden text-body text-muted sm:block">{session.username}</span>
			<Button variant="outlined" data-testid="sign-out" onClick={handleSignOut} className="px-3">
				Sign out
			</Button>
		</div>
	)
}
