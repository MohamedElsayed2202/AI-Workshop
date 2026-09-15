import type { ButtonHTMLAttributes } from 'react'
import { match } from 'ts-pattern'
import { cn } from '@shared/helpers/cn'

export type ButtonVariant = 'primary' | 'outlined' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
}

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
	const variantClasses = match(variant)
		.with('primary', () => 'bg-brand text-brand-contrast hover:bg-brand/90')
		.with('outlined', () => 'border border-line bg-surface text-ink hover:bg-page')
		.with('danger', () => 'border border-transparent text-danger hover:border-danger/30 hover:bg-danger/5')
		.exhaustive()

	return (
		<button
			type={type}
			className={cn(
				'inline-flex min-h-[40px] items-center justify-center rounded-lg px-4 text-body font-semibold transition-colors',
				'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
				variantClasses,
				className,
			)}
			{...rest}
		/>
	)
}
