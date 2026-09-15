import MuiDialog from '@mui/material/Dialog'
import type { PaperProps } from '@mui/material/Paper'
import { Button } from './Button'

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

/** In-app confirmation. MUI supplies the focus trap and Escape handling only. */
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
	return (
		<MuiDialog
			open
			onClose={onCancel}
			slotProps={{
				paper: {
					'data-testid': testId,
					role: 'dialog',
					'aria-label': title,
					className: '!bg-surface !text-ink w-full max-w-[420px] rounded-xl',
				} as PaperProps,
			}}
		>
			<div className="p-5 sm:p-6">
				<h2 className="text-subTitle font-bold">{title}</h2>
				<p className="mt-2 text-body text-muted">{description}</p>
				<div className="mt-6 flex justify-end gap-2">
					<Button variant="outlined" data-testid={cancelTestId} onClick={onCancel}>
						Cancel
					</Button>
					<Button variant="primary" data-testid={confirmTestId} onClick={onConfirm} className="bg-danger hover:bg-danger/90">
						{confirmLabel}
					</Button>
				</div>
			</div>
		</MuiDialog>
	)
}
