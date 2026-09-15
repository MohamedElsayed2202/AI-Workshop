import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@shared/design-system/molecules/ConfirmDialog'
import { useDeleteUser } from '@users/queries'
import type { User } from '@/types'

export function DeleteUserDialog({ user, onClose }: { user: User; onClose: () => void }) {
	const { t } = useTranslation()
	const deleteUser = useDeleteUser()

	const handleConfirm = async () => {
		await deleteUser.mutateAsync(user.id)
		onClose()
	}

	return (
		<ConfirmDialog
			testId="confirm-delete"
			title={t('userDelete.title')}
			description={t('userDelete.description', { name: user.name })}
			confirmLabel={t('userDelete.confirm')}
			confirmTestId="confirm-yes"
			cancelTestId="confirm-no"
			onConfirm={handleConfirm}
			onCancel={onClose}
		/>
	)
}
