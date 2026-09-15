import { UserRow } from './UserRow'
import type { User } from '@/types'

interface UsersTableProps {
	users: User[]
	onEdit: (user: User) => void
	onDelete: (user: User) => void
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
	return (
		<div className="mt-4 min-w-0 max-w-full overflow-x-auto px-4 pb-4 sm:px-5 sm:pb-5">
			<table data-testid="users-table" className="w-full min-w-[900px] border-collapse text-body">
				<thead>
					<tr className="text-muted">
						<th scope="col" className="px-3 py-2 text-left font-normal">Name</th>
						<th scope="col" className="px-3 py-2 text-left font-normal">Email</th>
						<th scope="col" className="px-3 py-2 text-left font-normal">Role</th>
						<th scope="col" className="px-3 py-2 text-left font-normal">Team</th>
						<th scope="col" className="px-3 py-2 text-left font-normal">Status</th>
						<th scope="col" className="px-3 py-2 text-left font-normal">Last login</th>
						<th scope="col" className="relative px-3 py-2 text-right font-normal">
							<span className="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
					))}
				</tbody>
			</table>
		</div>
	)
}
