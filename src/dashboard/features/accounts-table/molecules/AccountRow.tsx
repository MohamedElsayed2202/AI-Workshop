import * as stylex from '@stylexjs/stylex'
import { HealthBar } from '@shared/design-system/atoms/HealthBar'
import { colors, space } from '@shared/design/tokens.stylex'
import { formatCurrency } from '@shared/helpers/format'
import { AccountStatusBadge } from './AccountStatusBadge'
import type { Account } from '@/types'

interface AccountRowProps {
	account: Account
	isSelected: boolean
	onSelect: (account: Account) => void
}

export function AccountRow({ account, isSelected, onSelect }: AccountRowProps) {
	return (
		<tr
			data-testid="account-row"
			data-account-id={account.id}
			onClick={() => onSelect(account)}
			aria-label={`Open details for ${account.name}`}
			{...stylex.props(styles.row, isSelected && styles.selected)}
		>
			<td {...stylex.props(styles.cell, styles.name)}>{account.name}</td>
			<td {...stylex.props(styles.cell)}>{account.plan}</td>
			<td {...stylex.props(styles.cell)}>{account.region}</td>
			<td {...stylex.props(styles.cell)}>{account.owner}</td>
			<td data-testid="cell-mrr" {...stylex.props(styles.cell, styles.numeric)}>
				{formatCurrency(account.mrr)}
			</td>
			<td {...stylex.props(styles.cell, styles.numeric)}>{account.seats}</td>
			<td {...stylex.props(styles.cell)}>
				<AccountStatusBadge status={account.status} />
			</td>
			<td {...stylex.props(styles.cell)}>
				<HealthBar score={account.health} />
			</td>
		</tr>
	)
}

const styles = stylex.create({
	row: {
		backgroundColor: { default: 'transparent', ':hover': colors.hover },
		borderTopColor: colors.line,
		borderTopStyle: 'solid',
		borderTopWidth: '1px',
		cursor: 'pointer',
		transitionDuration: '150ms',
		transitionProperty: 'background-color',
	},
	selected: { backgroundColor: { default: colors.brandTint, ':hover': colors.brandTint } },
	cell: { paddingBlock: space.md, paddingInline: space.md, whiteSpace: 'nowrap' },
	name: { fontWeight: 600 },
	numeric: { fontVariantNumeric: 'tabular-nums', textAlign: 'end' },
})
