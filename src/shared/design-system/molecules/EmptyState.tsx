import * as stylex from '@stylexjs/stylex'
import { colors, space, text } from '@shared/design/tokens.stylex'

export function EmptyState({ testId, message }: { testId: string; message: string }) {
	return (
		<p data-testid={testId} {...stylex.props(styles.empty)}>
			{message}
		</p>
	)
}

const styles = stylex.create({
	empty: {
		color: colors.muted,
		fontSize: text.body,
		paddingBlock: space.xxl,
		paddingInline: space.md,
		textAlign: 'center',
	},
})
