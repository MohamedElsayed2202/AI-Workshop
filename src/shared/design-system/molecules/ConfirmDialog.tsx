import * as stylex from '@stylexjs/stylex'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { breakpoint } from '@shared/design/media.stylex'
import { Button } from '@shared/design-system/atoms/Button'
import { colors, radius, shadow, space, text } from '@shared/design/tokens.stylex'

interface ConfirmDialogProps {
	testId: string
	title: string
	description: string
	confirmLabel: string
	confirmTestId: string
	cancelTestId: string
	onConfirm: () => void
	onCancel: () => void
}

/** In-app confirmation, on the native <dialog> element. Never window.confirm. */
export function ConfirmDialog({
	testId,
	title,
	description,
	confirmLabel,
	confirmTestId,
	cancelTestId,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const { t } = useTranslation()
	const dialogRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog || dialog.open) return
		dialog.showModal()
		return () => dialog.close()
	}, [])

	return (
		<dialog
			ref={dialogRef}
			data-testid={testId}
			role="dialog"
			aria-label={title}
			onCancel={(event) => {
				event.preventDefault()
				onCancel()
			}}
			onClose={onCancel}
			{...stylex.props(styles.dialog)}
		>
			<div {...stylex.props(styles.body)}>
				<h2 {...stylex.props(styles.title)}>{title}</h2>
				<p {...stylex.props(styles.description)}>{description}</p>
				<div {...stylex.props(styles.actions)}>
					<Button variant="outlined" data-testid={cancelTestId} onClick={onCancel}>
						{t('common.cancel')}
					</Button>
					<Button variant="destructive" data-testid={confirmTestId} onClick={onConfirm}>
						{confirmLabel}
					</Button>
				</div>
			</div>
		</dialog>
	)
}

const styles = stylex.create({
	dialog: {
		backgroundColor: colors.surface,
		borderRadius: radius.xl,
		borderStyle: 'none',
		boxShadow: shadow.panel,
		color: colors.ink,
		margin: 'auto',
		maxWidth: `calc(100% - ${space.xxl})`,
		padding: 0,
		width: { default: `calc(100% - ${space.xxl})`, [breakpoint.sm]: '420px' },
		'::backdrop': { backgroundColor: colors.overlay },
	},
	body: { padding: { default: space.xl, [breakpoint.sm]: space.xxl } },
	title: { fontSize: text.subTitle, fontWeight: 700, margin: 0 },
	description: { color: colors.muted, fontSize: text.body, margin: 0, marginTop: space.sm },
	actions: { display: 'flex', gap: space.sm, justifyContent: 'flex-end', marginTop: space.xxl },
})
