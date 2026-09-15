import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { colors, space, text } from '@shared/design/tokens.stylex'

interface FormFieldProps {
	label: string
	htmlFor: string
	error?: string
	/**
	 * Test hook for the inline message. Only the first errored field in a form
	 * should receive one, so the page never has two matching elements.
	 */
	errorTestId?: string
	children: ReactNode
}

/** Label, control and inline error — the unit every form is built from. */
export function FormField({ label, htmlFor, error, errorTestId, children }: FormFieldProps) {
	return (
		<div {...stylex.props(styles.field)}>
			<label htmlFor={htmlFor} {...stylex.props(styles.label)}>
				{label}
			</label>
			{children}
			{error ? (
				<p data-testid={errorTestId} {...stylex.props(styles.error)}>
					{error}
				</p>
			) : null}
		</div>
	)
}

const styles = stylex.create({
	field: { display: 'flex', flexDirection: 'column', gap: space.xs },
	label: { color: colors.muted, fontSize: text.body },
	error: { color: colors.danger, fontSize: text.body, margin: 0, marginTop: '2px' },
})
