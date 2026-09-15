import * as stylex from '@stylexjs/stylex'
import { useTranslation } from 'react-i18next'
import { Avatar } from '@shared/design-system/atoms/Avatar'
import { Button } from '@shared/design-system/atoms/Button'
import { colors, space } from '@shared/design/tokens.stylex'
import { formatDate } from '@shared/helpers/format'
import { UserStatusBadge } from './UserStatusBadge'
import type { User } from '@/types'

interface UserRowProps {
	user: User
	onEdit: (user: User) => void
	onDelete: (user: User) => void
}

export function UserRow({ user, onEdit, onDelete }: UserRowProps) {
	const { t } = useTranslation()
	return (
		<tr data-testid="user-row" data-user-id={user.id} {...stylex.props(styles.row)}>
			<td {...stylex.props(styles.cell)}>
				<span {...stylex.props(styles.person)}>
					<Avatar name={user.name} />
					<span {...stylex.props(styles.name)}>{user.name}</span>
				</span>
			</td>
			<td {...stylex.props(styles.cell)}>{user.email}</td>
			<td {...stylex.props(styles.cell)}>{user.role}</td>
			<td {...stylex.props(styles.cell)}>{user.team}</td>
			<td {...stylex.props(styles.cell)}>
				<UserStatusBadge status={user.status} />
			</td>
			<td {...stylex.props(styles.cell)}>{formatDate(user.lastLoginAt)}</td>
			<td {...stylex.props(styles.cell)}>
				<span {...stylex.props(styles.actions)}>
					<Button variant="outlined" compact data-testid="user-edit" onClick={() => onEdit(user)}>
						{t('users.edit')}
					</Button>
					<Button variant="danger" compact data-testid="user-delete" onClick={() => onDelete(user)}>
						{t('users.delete')}
					</Button>
				</span>
			</td>
		</tr>
	)
}

const styles = stylex.create({
	row: { borderTopColor: colors.line, borderTopStyle: 'solid', borderTopWidth: '1px' },
	cell: { paddingBlock: space.md, paddingInline: space.md, whiteSpace: 'nowrap' },
	person: { alignItems: 'center', display: 'flex', gap: space.md },
	name: { fontWeight: 600 },
	actions: { display: 'flex', gap: space.sm, justifyContent: 'flex-end' },
})
