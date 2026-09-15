import { match } from 'ts-pattern'
import { cn } from '@shared/helpers/cn'
import type { AccountStatus, UserStatus } from '@/types'

/**
 * Status pills. Branching is exhaustive so a new status becomes a compile
 * error rather than an untinted pill.
 */
export function AccountStatusBadge({ status }: { status: AccountStatus }) {
	const tone = match(status)
		.with('Active', () => 'bg-positive/10 text-positive')
		.with('Trial', () => 'bg-brand/10 text-brand')
		.with('At risk', () => 'bg-warn/10 text-warn')
		.with('Churned', () => 'bg-ink/5 text-muted')
		.exhaustive()

	return <Pill className={tone}>{status}</Pill>
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
	const tone = match(status)
		.with('Active', () => 'bg-positive/10 text-positive')
		.with('Invited', () => 'bg-brand/10 text-brand')
		.with('Suspended', () => 'bg-danger/10 text-danger')
		.exhaustive()

	return <Pill className={tone}>{status}</Pill>
}

function Pill({ children, className }: { children: string; className: string }) {
	return (
		<span className={cn('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-label font-semibold', className)}>
			{children}
		</span>
	)
}
