import { match } from 'ts-pattern'
import { Badge, type BadgeTone } from '@shared/design-system/atoms/Badge'
import type { AccountStatus } from '@/types'

/** Maps a domain status onto a design-system tone. Exhaustive by construction. */
export function AccountStatusBadge({ status }: { status: AccountStatus }) {
	const tone: BadgeTone = match(status)
		.with('Active', () => 'positive' as const)
		.with('Trial', () => 'brand' as const)
		.with('At risk', () => 'warn' as const)
		.with('Churned', () => 'neutral' as const)
		.exhaustive()

	return <Badge tone={tone}>{status}</Badge>
}
