import { AccountStatusBadge } from '@shared/components/ui/Badge'
import { HealthBar } from '@shared/components/ui/HealthBar'
import { OverlayPanel } from '@shared/components/ui/OverlayPanel'
import { formatCurrency, formatDate } from '@shared/helpers/format'
import type { Account } from '@/types'
import type { ReactNode } from 'react'

export function AccountDetailDrawer({ account, onClose }: { account: Account; onClose: () => void }) {
	return (
		<OverlayPanel testId="detail-drawer" eyebrow="Account" title={account.name} onClose={onClose}>
			<dl className="grid grid-cols-2 gap-x-6 gap-y-5">
				<Field label="Plan">{account.plan}</Field>
				<Field label="Region">{account.region}</Field>
				<Field label="MRR">{formatCurrency(account.mrr)}</Field>
				<Field label="Seats">{account.seats}</Field>
				<Field label="Status">
					<AccountStatusBadge status={account.status} />
				</Field>
				<Field label="Health">
					<HealthBar score={account.health} />
				</Field>
				<Field label="Signed up">{formatDate(account.signedUpAt)}</Field>
				<Field label="Last active">{formatDate(account.lastActiveAt)}</Field>
				<Field label="Owner" span>
					<span className="block">{account.owner}</span>
					<a href={`mailto:${account.ownerEmail}`} className="text-brand underline">
						{account.ownerEmail}
					</a>
				</Field>
				<Field label="Notes" span>
					<span className="block leading-relaxed">{account.notes}</span>
				</Field>
			</dl>
		</OverlayPanel>
	)
}

function Field({ label, children, span = false }: { label: string; children: ReactNode; span?: boolean }) {
	return (
		<div className={span ? 'col-span-2' : undefined}>
			<dt className="text-body text-muted">{label}</dt>
			<dd className="mt-1 text-subTitle font-semibold">{children}</dd>
		</div>
	)
}
