import * as stylex from '@stylexjs/stylex'
import { VisuallyHidden } from '@shared/design-system/atoms/VisuallyHidden'
import { DataTable } from '@shared/design-system/molecules/DataTable'
import { space } from '@shared/design/tokens.stylex'
import { UserRow } from '../molecules/UserRow'
import type { User } from '@/types'

interface UsersTableProps {
	users: User[]
	onEdit: (user: User) => void
	onDelete: (user: User) => void
}

const COLUMNS = ['Name', 'Email', 'Role', 'Team', 'Status', 'Last login'] as const

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
	const header = (
		<>
			{COLUMNS.map((column) => (
				<th key={column} scope="col" {...stylex.props(styles.heading)}>
					{column}
				</th>
			))}
			<th scope="col" {...stylex.props(styles.heading, styles.actionsHeading)}>
				<VisuallyHidden>Actions</VisuallyHidden>
			</th>
		</>
	)

	return (
		<DataTable testId="users-table" minWidth="900px" head={header}>
			{users.map((user) => (
				<UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
			))}
		</DataTable>
	)
}

const styles = stylex.create({
	heading: { fontWeight: 400, paddingBlock: space.sm, paddingInline: space.md, textAlign: 'start' },
	actionsHeading: { textAlign: 'end' },
})
