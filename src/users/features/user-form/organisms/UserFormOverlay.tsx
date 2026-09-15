import { appConfig } from '@/app/config'
import { useCreateUser, useUpdateUser } from '@users/queries'
import { formValuesToPayload } from '../utils'
import { UserFormView } from './UserFormView'
import type { OverlayPresentation } from '@shared/design-system/molecules/Modal'
import type { UserFormValues } from '../schemas'
import type { User } from '@/types'

interface UserFormOverlayProps {
	user: User | null
	onClose: () => void
	/** Overrides the configured default, which is a dialog. */
	presentation?: OverlayPresentation
}

/** Container: owns the mutations, hands the view plain props. */
export function UserFormOverlay({
	user,
	onClose,
	presentation = appConfig.userFormPresentation,
}: UserFormOverlayProps) {
	const createUser = useCreateUser()
	const updateUser = useUpdateUser()

	const handleSubmit = async (values: UserFormValues) => {
		const payload = formValuesToPayload(values)
		if (user) {
			await updateUser.mutateAsync({ userId: user.id, payload })
		} else {
			await createUser.mutateAsync(payload)
		}
		onClose()
	}

	return (
		<UserFormView
			presentation={presentation}
			user={user}
			isSaving={createUser.isPending || updateUser.isPending}
			onSubmit={handleSubmit}
			onClose={onClose}
		/>
	)
}
