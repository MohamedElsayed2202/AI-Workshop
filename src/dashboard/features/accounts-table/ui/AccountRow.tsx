import { AccountStatusBadge } from '@shared/components/ui/Badge'
import { HealthBar } from '@shared/components/ui/HealthBar'
import { cn } from '@shared/helpers/cn'
import { formatCurrency } from '@shared/helpers/format'
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
			className={cn(
				'cursor-pointer border-t border-line transition-colors hover:bg-page',
				isSelected && 'bg-brand-tint hover:bg-brand-tint',
			)}
		>
			<td className="whitespace-nowrap px-3 py-3 font-semibold">{account.name}</td>
			<td className="whitespace-nowrap px-3 py-3">{account.plan}</td>
			<td className="whitespace-nowrap px-3 py-3">{account.region}</td>
			<td className="whitespace-nowrap px-3 py-3">{account.owner}</td>
			<td data-testid="cell-mrr" className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
				{formatCurrency(account.mrr)}
			</td>
			<td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{account.seats}</td>
			<td className="whitespace-nowrap px-3 py-3">
				<AccountStatusBadge status={account.status} />
			</td>
			<td className="whitespace-nowrap px-3 py-3">
				<HealthBar score={account.health} />
			</td>
		</tr>
	)
}
