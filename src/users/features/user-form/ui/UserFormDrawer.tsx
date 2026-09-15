import { useCreateUser, useUpdateUser } from '@users/queries'
import { formValuesToPayload } from '../utils'
import { UserFormDrawerView } from './UserFormDrawerView'
import type { UserFormValues } from '../schemas'
import type { User } from '@/types'

/** Container: owns the mutations, hands the view plain props. */
export function UserFormDrawer({ user, onClose }: { user: User | null; onClose: () => void }) {
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
		<UserFormDrawerView
			user={user}
			isSaving={createUser.isPending || updateUser.isPending}
			onSubmit={handleSubmit}
			onClose={onClose}
		/>
	)
}
