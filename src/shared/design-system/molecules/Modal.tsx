import * as stylex from '@stylexjs/stylex'
import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { breakpoint } from '@shared/design/media.stylex'
import { colors, layout, radius, shadow, space, text } from '@shared/design/tokens.stylex'

/** How an overlay presents itself. Behaviour is identical either way. */
export type OverlayPresentation = 'drawer' | 'dialog'

interface ModalProps {
	presentation?: OverlayPresentation
	testId: string
	closeTestId?: string
	eyebrow: string
	title: string
	onClose: () => void
	children: ReactNode
}

/**
 * Built on the native <dialog> element, which supplies the focus trap, the
 * Escape key, inert background content and top-layer stacking with no library.
 * Because it stays in the DOM where it is written, it also inherits the theme
 * variables — something a portalled overlay does not.
 */
export function Modal({
	presentation = 'drawer',
	testId,
	closeTestId = 'drawer-close',
	eyebrow,
	title,
	onClose,
	children,
}: ModalProps) {
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
			// Escape fires `cancel`. The native `close` event is deliberately NOT wired
			// to onClose: the cleanup below calls close(), and under StrictMode that
			// would close the dialog the instant it opened.
			onCancel={(event) => {
				event.preventDefault()
				onClose()
			}}
			onClick={(event) => {
				if (event.target === dialogRef.current) onClose()
			}}
			{...stylex.props(styles.base, presentation === 'drawer' ? styles.drawer : styles.dialog)}
		>
			<div {...stylex.props(styles.body)}>
				<div {...stylex.props(styles.header)}>
					<div>
						<p {...stylex.props(styles.eyebrow)}>{eyebrow}</p>
						<h2 {...stylex.props(styles.title)}>{title}</h2>
					</div>
					<button
						type="button"
						data-testid={closeTestId}
						onClick={onClose}
						aria-label={t('overlay.closePanel')}
						{...stylex.props(styles.close)}
					>
						<span aria-hidden>✕</span>
					</button>
				</div>

				<div {...stylex.props(styles.content)}>{children}</div>
			</div>
		</dialog>
	)
}

const styles = stylex.create({
	base: {
		backgroundColor: colors.surface,
		borderStyle: 'none',
		color: colors.ink,
		maxHeight: 'none',
		maxWidth: 'none',
		padding: 0,
		'::backdrop': { backgroundColor: colors.overlay },
	},
	drawer: {
		blockSize: '100%',
		boxShadow: shadow.panel,
		height: '100%',
		inlineSize: { default: '100%', [breakpoint.sm]: layout.panelWidth },
		insetBlock: 0,
		insetInlineEnd: 0,
		insetInlineStart: 'auto',
		margin: 0,
		width: { default: '100%', [breakpoint.sm]: layout.panelWidth },
	},
	dialog: {
		borderRadius: radius.xl,
		boxShadow: shadow.panel,
		margin: 'auto',
		maxWidth: `calc(100% - ${space.xxl} * 2)`,
		width: { default: `calc(100% - ${space.xxl})`, [breakpoint.sm]: layout.dialogWidth },
	},
	body: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		overflowY: 'auto',
		padding: { default: space.xl, [breakpoint.sm]: space.xxl },
	},
	header: { display: 'flex', gap: space.lg, justifyContent: 'space-between' },
	eyebrow: { color: colors.muted, fontSize: text.body, margin: 0 },
	title: { fontSize: text.title, fontWeight: 700, margin: 0, marginTop: '2px' },
	close: {
		alignItems: 'center',
		backgroundColor: { default: colors.surface, ':hover': colors.hover },
		borderColor: colors.line,
		borderRadius: radius.md,
		borderStyle: 'solid',
		borderWidth: '1px',
		color: colors.ink,
		cursor: 'pointer',
		display: 'flex',
		flexShrink: 0,
		height: '40px',
		justifyContent: 'center',
		width: '40px',
		outline: { default: 'none', ':focus-visible': `2px solid ${colors.brand}` },
		outlineOffset: '2px',
	},
	content: { marginTop: space.xxl },
})
