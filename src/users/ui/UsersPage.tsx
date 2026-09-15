import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Button } from '@shared/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@shared/components/ui/Card'
import { usersQueryOptions } from '@users/queries'
import { useUsersUiStore } from '@users/stores/usersUiStore'
import { DeleteUserDialog } from '@users/features/user-delete/ui/DeleteUserDialog'
import { UserFormDrawer } from '@users/features/user-form/ui/UserFormDrawer'
import { UsersTable } from '@users/features/user-list/ui/UsersTable'

export function UsersPage() {
	const { data: users, isPending } = useQuery({ ...usersQueryOptions, placeholderData: keepPreviousData })
	const { editingUser, isFormOpen, userPendingDeletion, openCreateForm, openEditForm, closeForm, requestDeletion, cancelDeletion } =
		useUsersUiStore()

	return (
		<div data-testid="users-page" className="flex flex-col gap-4 sm:gap-5">
			<Card>
				<CardHeader className="sm:items-center">
					<CardTitle title="Users" subtitle={`${users?.length ?? 0} people`} />
					<Button data-testid="user-create" onClick={openCreateForm}>
						+ New user
					</Button>
				</CardHeader>

				{isPending || !users ? (
					<p className="px-5 py-10 text-center text-body text-muted">Loading users…</p>
				) : (
					<UsersTable users={users} onEdit={openEditForm} onDelete={requestDeletion} />
				)}
			</Card>

			{isFormOpen ? <UserFormDrawer user={editingUser} onClose={closeForm} /> : null}
			{userPendingDeletion ? <DeleteUserDialog user={userPendingDeletion} onClose={cancelDeletion} /> : null}
		</div>
	)
}
