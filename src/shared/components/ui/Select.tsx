import type { SelectHTMLAttributes } from 'react'
import { cn } from '@shared/helpers/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label: string
	options: readonly string[]
	hasError?: boolean
}

/**
 * A real native <select>. MUI's Select renders a hidden input instead, which
 * neither the acceptance contract nor a plain form submission can read.
 */
export function Select({ label, options, hasError = false, id, className, ...rest }: SelectProps) {
	const selectId = id ?? `field-${rest.name}`

	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={selectId} className="text-body text-muted">
				{label}
			</label>
			<select
				id={selectId}
				aria-invalid={hasError || undefined}
				className={cn(
					'min-h-[44px] rounded-lg border bg-surface px-3 text-subTitle outline-none transition-colors',
					hasError ? 'border-danger focus:border-danger' : 'border-line focus:border-brand',
					className,
				)}
				{...rest}
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}
