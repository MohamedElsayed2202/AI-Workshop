import * as stylex from '@stylexjs/stylex'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { breakpoint } from '@shared/design/media.stylex'
import { Button } from '@shared/design-system/atoms/Button'
import { Card, CardHeader, CardTitle } from '@shared/design-system/molecules/Card'
import { colors, space, text } from '@shared/design/tokens.stylex'
import { usersQueryOptions } from '@users/queries'
import { useUsersUiStore } from '@users/stores/usersUiStore'
import { DeleteUserDialog } from '@users/features/user-delete/organisms/DeleteUserDialog'
import { UserFormOverlay } from '@users/features/user-form/organisms/UserFormOverlay'
import { UsersTable } from '@users/features/user-list/organisms/UsersTable'

export function UsersPage() {
	const { data: users, isPending } = useQuery({ ...usersQueryOptions, placeholderData: keepPreviousData })
	const {
		editingUser,
		isFormOpen,
		userPendingDeletion,
		openCreateForm,
		openEditForm,
		closeForm,
		requestDeletion,
		cancelDeletion,
	} = useUsersUiStore()

	return (
		<div data-testid="users-page" {...stylex.props(styles.page)}>
			<Card>
				<CardHeader align="center">
					<CardTitle title="Users" subtitle={`${users?.length ?? 0} people`} />
					<Button data-testid="user-create" onClick={openCreateForm}>
						+ New user
					</Button>
				</CardHeader>

				{isPending || !users ? (
					<p {...stylex.props(styles.loading)}>Loading users…</p>
				) : (
					<UsersTable users={users} onEdit={openEditForm} onDelete={requestDeletion} />
				)}
			</Card>

			{isFormOpen ? <UserFormOverlay user={editingUser} onClose={closeForm} /> : null}
			{userPendingDeletion ? <DeleteUserDialog user={userPendingDeletion} onClose={cancelDeletion} /> : null}
		</div>
	)
}

const styles = stylex.create({
	page: {
		display: 'flex',
		flexDirection: 'column',
		gap: { default: space.lg, [breakpoint.sm]: space.xl },
		minWidth: 0,
	},
	loading: {
		color: colors.muted,
		fontSize: text.body,
		paddingBlock: space.xxl,
		paddingInline: space.xl,
		textAlign: 'center',
	},
})
