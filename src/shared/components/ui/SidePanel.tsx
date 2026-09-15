import MuiDrawer from '@mui/material/Drawer'
import type { PaperProps } from '@mui/material/Paper'
import type { ReactNode } from 'react'

interface SidePanelProps {
	testId: string
	eyebrow: string
	title: string
	onClose: () => void
	children: ReactNode
}

/**
 * MUI's Drawer is used purely for behaviour — focus trap, Escape, portal and
 * scroll lock. Everything visual is Tailwind. Render it only while open (the
 * caller guards with `{isOpen && <SidePanel … />}`) so unmounting clears state.
 */
export function SidePanel({ testId, eyebrow, title, onClose, children }: SidePanelProps) {
	return (
		<MuiDrawer
			open
			anchor="right"
			onClose={onClose}
			slotProps={{
				paper: {
					'data-testid': testId,
					role: 'dialog',
					'aria-label': title,
					className: '!bg-surface !text-ink w-full max-w-full sm:w-[440px]',
				} as PaperProps,
			}}
		>
			<div className="flex h-full flex-col overflow-y-auto p-5 sm:p-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-body text-muted">{eyebrow}</p>
						<h2 className="mt-0.5 text-title font-bold tracking-tight">{title}</h2>
					</div>
					<button
						type="button"
						data-testid="drawer-close"
						onClick={onClose}
						aria-label="Close panel"
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-lg text-ink transition-colors hover:bg-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
					>
						<span aria-hidden>✕</span>
					</button>
				</div>

				<div className="mt-6">{children}</div>
			</div>
		</MuiDrawer>
	)
}
