import MuiDialog from '@mui/material/Dialog'
import MuiDrawer from '@mui/material/Drawer'
import type { PaperProps } from '@mui/material/Paper'
import type { ReactNode } from 'react'
import { match } from 'ts-pattern'

/** How an overlay presents itself. Behaviour (focus trap, Escape) is identical. */
export type OverlayPresentation = 'drawer' | 'dialog'

interface OverlayPanelProps {
	presentation?: OverlayPresentation
	testId: string
	closeTestId?: string
	eyebrow: string
	title: string
	onClose: () => void
	children: ReactNode
}

/**
 * MUI supplies behaviour only — focus trap, Escape, portal and scroll lock.
 * Everything visual is Tailwind, which is why the paper's own skin is overridden.
 */
export function OverlayPanel({
	presentation = 'drawer',
	testId,
	closeTestId = 'drawer-close',
	eyebrow,
	title,
	onClose,
	children,
}: OverlayPanelProps) {
	const paperProps = (extraClasses: string) =>
		({
			'data-testid': testId,
			role: 'dialog',
			'aria-label': title,
			className: `!bg-surface !text-ink ${extraClasses}`,
		}) as PaperProps

	const body = (
		<div className="flex h-full flex-col overflow-y-auto p-5 sm:p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-body text-muted">{eyebrow}</p>
					<h2 className="mt-0.5 text-title font-bold tracking-tight">{title}</h2>
				</div>
				<button
					type="button"
					data-testid={closeTestId}
					onClick={onClose}
					aria-label="Close panel"
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-lg text-ink transition-colors hover:bg-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
				>
					<span aria-hidden>✕</span>
				</button>
			</div>

			<div className="mt-6">{children}</div>
		</div>
	)

	return match(presentation)
		.with('drawer', () => (
			<MuiDrawer open anchor="right" onClose={onClose} slotProps={{ paper: paperProps('w-full max-w-full sm:w-[440px]') }}>
				{body}
			</MuiDrawer>
		))
		.with('dialog', () => (
			<MuiDialog
				open
				fullWidth
				onClose={onClose}
				slotProps={{ paper: paperProps('m-4 w-full max-w-[520px] rounded-xl') }}
			>
				{body}
			</MuiDialog>
		))
		.exhaustive()
}
