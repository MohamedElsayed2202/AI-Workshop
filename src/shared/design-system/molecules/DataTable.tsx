import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { breakpoint } from '@shared/design/media.stylex'
import { colors, space, text } from '@shared/design/tokens.stylex'

interface DataTableProps {
	testId: string
	minWidth: string
	head: ReactNode
	children: ReactNode
	footer?: ReactNode
}

/**
 * A table inside its own horizontal scroll container, so a wide table never
 * makes the page itself scroll sideways.
 */
export function DataTable({ testId, minWidth, head, children, footer }: DataTableProps) {
	return (
		<div {...stylex.props(styles.scroll)}>
			<table data-testid={testId} {...stylex.props(styles.table)} style={{ minWidth }}>
				<thead>
					<tr {...stylex.props(styles.headRow)}>{head}</tr>
				</thead>
				<tbody>{children}</tbody>
			</table>
			{footer}
		</div>
	)
}

const styles = stylex.create({
	scroll: {
		marginTop: space.lg,
		maxWidth: '100%',
		minWidth: 0,
		overflowX: 'auto',
		paddingBottom: { default: space.lg, [breakpoint.sm]: space.xl },
		paddingInline: { default: space.lg, [breakpoint.sm]: space.xl },
	},
	table: { borderCollapse: 'collapse', fontSize: text.body, width: '100%' },
	headRow: { color: colors.muted },
})
