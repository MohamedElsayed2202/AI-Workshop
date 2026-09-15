import type { Config } from 'tailwindcss'

/**
 * Design tokens are declared once as CSS variables in src/index.css and mapped here.
 * Re-branding the app is therefore a one-file change.
 */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		screens: {
			sm: '600px',
			md: '900px',
			lg: '1280px',
			xl: '1536px',
		},
		extend: {
			colors: {
				brand: {
					DEFAULT: 'var(--pb-brand)',
					soft: 'var(--pb-brand-soft)',
					tint: 'var(--pb-brand-tint)',
					contrast: 'var(--pb-on-brand)',
				},
				page: 'var(--pb-page)',
				surface: 'var(--pb-surface)',
				line: 'var(--pb-line)',
				ink: 'var(--pb-ink)',
				muted: 'var(--pb-muted)',
				positive: 'var(--pb-positive)',
				danger: 'var(--pb-danger)',
				warn: 'var(--pb-warn)',
				target: 'var(--pb-target)',
			},
			fontSize: {
				label: ['0.75rem', { lineHeight: '1rem' }],
				body: ['0.875rem', { lineHeight: '1.25rem' }],
				subTitle: ['1rem', { lineHeight: '1.5rem' }],
				title: ['1.5rem', { lineHeight: '2rem' }],
			},
			boxShadow: {
				card: '0 1px 2px rgb(16 24 40 / 0.04), 0 1px 3px rgb(16 24 40 / 0.06)',
				panel: '-8px 0 24px rgb(16 24 40 / 0.08)',
			},
		},
	},
	plugins: [],
} satisfies Config
