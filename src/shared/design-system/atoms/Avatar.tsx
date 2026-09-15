import * as stylex from '@stylexjs/stylex'
import { colors, radius, text } from '@shared/design/tokens.stylex'
import { toInitials } from '@shared/helpers/format'

/** Initials chip. Decorative — the name is always rendered next to it. */
export function Avatar({ name }: { name: string }) {
	return (
		<span aria-hidden {...stylex.props(styles.avatar)}>
			{toInitials(name)}
		</span>
	)
}

const styles = stylex.create({
	avatar: {
		alignItems: 'center',
		backgroundColor: colors.brandTint,
		borderRadius: radius.pill,
		color: colors.brand,
		display: 'flex',
		flexShrink: 0,
		fontSize: text.label,
		fontWeight: 700,
		height: '32px',
		justifyContent: 'center',
		width: '32px',
	},
})
