import * as stylex from '@stylexjs/stylex'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@shared/design-system/atoms/Avatar'
import { Button } from '@shared/design-system/atoms/Button'
import { breakpoint } from '@shared/design/media.stylex'
import { colors, space, text } from '@shared/design/tokens.stylex'
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
		<div {...stylex.props(styles.menu)}>
			<Avatar name={session.username} />
			<span {...stylex.props(styles.username)}>{session.username}</span>
			<Button variant="outlined" compact data-testid="sign-out" onClick={handleSignOut}>
				Sign out
			</Button>
		</div>
	)
}

const styles = stylex.create({
	menu: { alignItems: 'center', display: 'flex', gap: space.sm },
	username: { color: colors.muted, display: { default: 'none', [breakpoint.sm]: 'block' }, fontSize: text.body },
})
