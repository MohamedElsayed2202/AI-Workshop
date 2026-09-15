import * as stylex from '@stylexjs/stylex'
import type { ButtonHTMLAttributes } from 'react'
import { colors, radius, space, text } from '@shared/design/tokens.stylex'

export type ButtonVariant = 'primary' | 'outlined' | 'danger' | 'destructive'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
	fullWidth?: boolean
	/** Tighter horizontal padding, for controls that sit inside a table row. */
	compact?: boolean
}

export function Button({
	variant = 'primary',
	fullWidth = false,
	compact = false,
	type = 'button',
	...rest
}: ButtonProps) {
	return (
		<button
			type={type}
			{...stylex.props(styles.base, styles[variant], compact && styles.compact, fullWidth && styles.fullWidth)}
			{...rest}
		/>
	)
}

const styles = stylex.create({
	base: {
		alignItems: 'center',
		borderRadius: radius.md,
		borderStyle: 'none',
		cursor: 'pointer',
		display: 'inline-flex',
		fontSize: text.body,
		fontWeight: 600,
		justifyContent: 'center',
		minHeight: '40px',
		paddingInline: space.lg,
		transitionDuration: '150ms',
		transitionProperty: 'background-color, border-color, color',
		outline: {
			default: 'none',
			':focus-visible': `2px solid ${colors.brand}`,
		},
		outlineOffset: '2px',
	},
	primary: {
		backgroundColor: { default: colors.brand, ':hover': colors.brand },
		color: colors.onBrand,
		opacity: { default: 1, ':hover': 0.92 },
	},
	outlined: {
		backgroundColor: { default: colors.surface, ':hover': colors.hover },
		borderColor: colors.line,
		borderStyle: 'solid',
		borderWidth: '1px',
		color: colors.ink,
	},
	danger: {
		backgroundColor: { default: 'transparent', ':hover': colors.dangerSoft },
		borderColor: { default: 'transparent', ':hover': colors.danger },
		borderStyle: 'solid',
		borderWidth: '1px',
		color: colors.danger,
	},
	compact: { paddingInline: space.md },
	destructive: {
		backgroundColor: colors.danger,
		color: colors.onBrand,
		opacity: { default: 1, ':hover': 0.92 },
	},
	fullWidth: { width: '100%' },
})
