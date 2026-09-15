import { match } from 'ts-pattern'
import { cn } from '@shared/helpers/cn'
import type { AccountSort, AccountSortKey } from '../utils'

interface SortableHeaderProps {
	label: string
	sortKey: AccountSortKey
	sort: AccountSort | null
	onToggle: (key: AccountSortKey) => void
	align?: 'left' | 'right'
}

export function SortableHeader({ label, sortKey, sort, onToggle, align = 'left' }: SortableHeaderProps) {
	const isActive = sort?.key === sortKey
	const indicator = !isActive ? '' : match(sort.direction).with('asc', () => '↑').with('desc', () => '↓').exhaustive()

	return (
		<th scope="col" className={cn('px-3 py-2 font-normal', align === 'right' ? 'text-right' : 'text-left')}>
			<button
				type="button"
				data-testid={`sort-${sortKey}`}
				onClick={() => onToggle(sortKey)}
				aria-label={`Sort by ${label}`}
				className={cn(
					'inline-flex items-center gap-1 rounded text-body transition-colors hover:text-ink',
					'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
					isActive ? 'font-semibold text-ink' : 'text-muted',
				)}
			>
				{label}
				{indicator ? <span aria-hidden>{indicator}</span> : null}
			</button>
		</th>
	)
}
