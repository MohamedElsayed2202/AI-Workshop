import * as stylex from '@stylexjs/stylex'
import type { SelectHTMLAttributes } from 'react'
import { colors, radius, space, text } from '@shared/design/tokens.stylex'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	options: readonly string[]
	hasError?: boolean
}

/** A real native <select> — the platform control, styled, not reimplemented. */
export function Select({ options, hasError = false, ...rest }: SelectProps) {
	return (
		<select aria-invalid={hasError || undefined} {...stylex.props(styles.select, hasError && styles.errored)} {...rest}>
			{options.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	)
}

const styles = stylex.create({
	select: {
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
