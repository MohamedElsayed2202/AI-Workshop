import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { HealthBar } from '@shared/design-system/atoms/HealthBar'
import { Modal } from '@shared/design-system/molecules/Modal'
import { colors, space, text } from '@shared/design/tokens.stylex'
import { formatCurrency, formatDate } from '@shared/helpers/format'
import { AccountStatusBadge } from '@dashboard/features/accounts-table/molecules/AccountStatusBadge'
import type { Account } from '@/types'

export function AccountDetailDrawer({ account, onClose }: { account: Account; onClose: () => void }) {
	const { t } = useTranslation()
	return (
		<Modal testId="detail-drawer" eyebrow={t('dashboard.accountDetail.eyebrow')} title={account.name} onClose={onClose}>
			<dl {...stylex.props(styles.grid)}>
				<Field label={t('dashboard.accountDetail.plan')}>{account.plan}</Field>
				<Field label={t('dashboard.accountDetail.region')}>{account.region}</Field>
				<Field label={t('dashboard.accountDetail.mrr')}>{formatCurrency(account.mrr)}</Field>
				<Field label={t('dashboard.accountDetail.seats')}>{account.seats}</Field>
				<Field label={t('dashboard.accountDetail.status')}>
					<AccountStatusBadge status={account.status} />
				</Field>
				<Field label={t('dashboard.accountDetail.health')}>
					<HealthBar score={account.health} />
				</Field>
				<Field label={t('dashboard.accountDetail.signedUp')}>{formatDate(account.signedUpAt)}</Field>
				<Field label={t('dashboard.accountDetail.lastActive')}>{formatDate(account.lastActiveAt)}</Field>
				<Field label={t('dashboard.accountDetail.owner')} span>
					<span {...stylex.props(styles.block)}>{account.owner}</span>
					<a href={`mailto:${account.ownerEmail}`} {...stylex.props(styles.link)}>
						{account.ownerEmail}
					</a>
				</Field>
				<Field label={t('dashboard.accountDetail.notes')} span>
					<span {...stylex.props(styles.notes)}>{account.notes}</span>
				</Field>
			</dl>
		</Modal>
	)
}

function Field({ label, children, span = false }: { label: string; children: ReactNode; span?: boolean }) {
	return (
		<div {...stylex.props(span && styles.span)}>
			<dt {...stylex.props(styles.term)}>{label}</dt>
			<dd {...stylex.props(styles.value)}>{children}</dd>
		</div>
	)
}

const styles = stylex.create({
	grid: {
		columnGap: space.xxl,
		display: 'grid',
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		margin: 0,
		rowGap: space.xl,
	},
	span: { gridColumn: '1 / -1' },
	term: { color: colors.muted, fontSize: text.body },
	value: { fontSize: text.subTitle, fontWeight: 600, margin: 0, marginTop: space.xs },
	block: { display: 'block' },
	link: { color: colors.brand, textDecoration: 'underline' },
	notes: { display: 'block', fontWeight: 400, lineHeight: 1.6 },
})
