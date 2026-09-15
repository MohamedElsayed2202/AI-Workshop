import { cn } from '@shared/helpers/cn'

/** A 0-100 account health score as a track, a bar and the number. */
export function HealthBar({ score }: { score: number }) {
	const tone = score >= 70 ? 'bg-positive' : score >= 50 ? 'bg-warn' : 'bg-danger'

	return (
		<span className="flex items-center gap-2">
			<span className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-ink/10">
				<span className={cn('block h-full rounded-full', tone)} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
			</span>
			<span className="tabular-nums">{score}</span>
		</span>
	)
}
