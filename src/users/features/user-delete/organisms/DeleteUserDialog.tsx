import { ConfirmDialog } from '@shared/design-system/molecules/ConfirmDialog'
import { useDeleteUser } from '@users/queries'
import type { User } from '@/types'

export function DeleteUserDialog({ user, onClose }: { user: User; onClose: () => void }) {
	const deleteUser = useDeleteUser()

	const handleConfirm = async () => {
		await deleteUser.mutateAsync(user.id)
		onClose()
	}

	return (
		<ConfirmDialog
			testId="confirm-delete"
			title="Delete user"
			description={`${user.name} will lose access to PulseBoard. This cannot be undone.`}
			confirmLabel="Delete"
			confirmTestId="confirm-yes"
			cancelTestId="confirm-no"
			onConfirm={handleConfirm}
			onCancel={onClose}
		/>
	)
}
