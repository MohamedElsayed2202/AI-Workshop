import { Button } from '@shared/components/ui/Button'
import { UserStatusBadge } from '@shared/components/ui/Badge'
import { formatDate, toInitials } from '@shared/helpers/format'
import type { User } from '@/types'

interface UserRowProps {
	user: User
	onEdit: (user: User) => void
	onDelete: (user: User) => void
}

export function UserRow({ user, onEdit, onDelete }: UserRowProps) {
	return (
		<tr data-testid="user-row" data-user-id={user.id} className="border-t border-line">
			<td className="whitespace-nowrap px-3 py-3">
				<span className="flex items-center gap-3">
					<span
						aria-hidden
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-tint text-label font-bold text-brand"
					>
						{toInitials(user.name)}
					</span>
					<span className="font-semibold">{user.name}</span>
				</span>
			</td>
			<td className="whitespace-nowrap px-3 py-3">{user.email}</td>
			<td className="whitespace-nowrap px-3 py-3">{user.role}</td>
			<td className="whitespace-nowrap px-3 py-3">{user.team}</td>
			<td className="whitespace-nowrap px-3 py-3">
				<UserStatusBadge status={user.status} />
			</td>
			<td className="whitespace-nowrap px-3 py-3">{formatDate(user.lastLoginAt)}</td>
			<td className="whitespace-nowrap px-3 py-3">
				<span className="flex justify-end gap-2">
					<Button variant="outlined" data-testid="user-edit" onClick={() => onEdit(user)} className="px-3">
						Edit
					</Button>
					<Button variant="danger" data-testid="user-delete" onClick={() => onDelete(user)} className="px-3">
						Delete
					</Button>
				</span>
			</td>
		</tr>
	)
}
