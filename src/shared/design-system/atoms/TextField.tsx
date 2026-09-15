import * as stylex from '@stylexjs/stylex'
import type { InputHTMLAttributes } from 'react'
import { colors, radius, space, text } from '@shared/design/tokens.stylex'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	hasError?: boolean
}

export function TextField({ hasError = false, ...rest }: TextFieldProps) {
	return (
		<input
			aria-invalid={hasError || undefined}
			{...stylex.props(styles.input, hasError && styles.errored)}
			{...rest}
		/>
	)
}

const styles = stylex.create({
	input: {
		backgroundColor: colors.surface,
		borderColor: { default: colors.line, ':focus': colors.brand },
		borderRadius: radius.md,
		borderStyle: 'solid',
		borderWidth: '1px',
		color: colors.ink,
		fontSize: text.subTitle,
		minHeight: '44px',
		outline: 'none',
		paddingInline: space.md,
		transitionDuration: '150ms',
		transitionProperty: 'border-color',
		width: '100%',
	},
	errored: { borderColor: { default: colors.danger, ':focus': colors.danger } },
})
