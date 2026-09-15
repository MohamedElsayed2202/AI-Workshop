import { match } from 'ts-pattern'
import { Badge, type BadgeTone } from '@shared/design-system/atoms/Badge'
import type { UserStatus } from '@/types'

export function UserStatusBadge({ status }: { status: UserStatus }) {
	const tone: BadgeTone = match(status)
		.with('Active', () => 'positive' as const)
		.with('Invited', () => 'brand' as const)
		.with('Suspended', () => 'danger' as const)
		.exhaustive()

	return <Badge tone={tone}>{status}</Badge>
}
