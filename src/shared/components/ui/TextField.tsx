import type { InputHTMLAttributes } from 'react'
import { cn } from '@shared/helpers/cn'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	hasError?: boolean
}

export function TextField({ label, hasError = false, id, className, ...rest }: TextFieldProps) {
	const inputId = id ?? `field-${rest.name}`

	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={inputId} className="text-body text-muted">
				{label}
			</label>
			<input
				id={inputId}
				aria-invalid={hasError || undefined}
				className={cn(
					'min-h-[44px] rounded-lg border px-3 text-subTitle outline-none transition-colors',
					hasError ? 'border-danger focus:border-danger' : 'border-line focus:border-brand',
					className,
				)}
				{...rest}
			/>
		</div>
	)
}
