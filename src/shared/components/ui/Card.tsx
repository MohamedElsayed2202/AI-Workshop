import type { ReactNode } from 'react'
import { cn } from '@shared/helpers/cn'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
	return <section className={cn('min-w-0 max-w-full rounded-xl border border-line bg-surface shadow-card', className)}>{children}</section>
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn('flex flex-wrap items-start justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5', className)}>{children}</div>
}

export function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<div>
			<h2 className="text-subTitle font-bold">{title}</h2>
			{subtitle ? <p className="text-body text-muted">{subtitle}</p> : null}
		</div>
	)
}
