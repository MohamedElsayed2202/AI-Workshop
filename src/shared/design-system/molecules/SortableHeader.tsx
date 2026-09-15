import * as stylex from '@stylexjs/stylex'
import { match } from 'ts-pattern'
import { useTranslation } from 'react-i18next'
import { colors, space, text } from '@shared/design/tokens.stylex'

export type SortDirection = 'asc' | 'desc'

interface SortableHeaderProps<TKey extends string> {
	label: string
	sortKey: TKey
	activeKey: TKey | null
	direction: SortDirection | null
	onToggle: (key: TKey) => void
	align?: 'start' | 'end'
}

/** A sortable column header. Generic over the sort key, so any table can use it. */
export function SortableHeader<TKey extends string>({
	label,
	sortKey,
	activeKey,
	direction,
	onToggle,
	align = 'start',
}: SortableHeaderProps<TKey>) {
	const { t } = useTranslation()
	const isActive = activeKey === sortKey
	const indicator =
		!isActive || !direction
			? null
			: match(direction)
					.with('asc', () => '↑')
					.with('desc', () => '↓')
					.exhaustive()

	return (
		<th scope="col" {...stylex.props(styles.cell, align === 'end' && styles.alignEnd)}>
			<button
				type="button"
				data-testid={`sort-${sortKey}`}
				onClick={() => onToggle(sortKey)}
				aria-label={t('dashboard.accounts.sortBy', { label })}
				{...stylex.props(styles.button, isActive && styles.active)}
			>
				{label}
				{indicator ? <span aria-hidden>{indicator}</span> : null}
			</button>
		</th>
	)
}

const styles = stylex.create({
	cell: {
		fontWeight: 400,
		paddingBlock: space.sm,
		paddingInline: space.md,
		textAlign: 'start',
	},
	alignEnd: { textAlign: 'end' },
	button: {
		alignItems: 'center',
		backgroundColor: 'transparent',
		borderStyle: 'none',
		color: { default: colors.muted, ':hover': colors.ink },
		cursor: 'pointer',
		display: 'inline-flex',
		fontSize: text.body,
		gap: space.xs,
		padding: 0,
		transitionDuration: '150ms',
		transitionProperty: 'color',
		outline: { default: 'none', ':focus-visible': `2px solid ${colors.brand}` },
		outlineOffset: '2px',
	},
	active: { color: colors.ink, fontWeight: 600 },
})
