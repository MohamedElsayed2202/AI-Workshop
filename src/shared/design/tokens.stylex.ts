import * as stylex from '@stylexjs/stylex'

/**
 * The PulseBoard design system tokens.
 *
 * Every colour, space, radius and type size in the app resolves to one of these,
 * so a rebrand is a change to this file alone. Values carry their own dark
 * variant, which covers visitors who never touch the theme toggle; an explicit
 * choice is layered on top by the themes in ./themes.ts.
 *
 * StyleX requires variable definitions to live in a `.stylex.ts` file that
 * exports nothing else.
 */

const DARK = '@media (prefers-color-scheme: dark)'

export const colors = stylex.defineVars({
	brand: { default: '#4f46e5', [DARK]: '#818cf8' },
	brandSoft: { default: '#a5b4fc', [DARK]: '#4c51bf' },
	brandTint: { default: '#eef2ff', [DARK]: '#272a4d' },
	onBrand: { default: '#ffffff', [DARK]: '#0e1117' },

	page: { default: '#f1f3f7', [DARK]: '#0e1117' },
	surface: { default: '#ffffff', [DARK]: '#171b23' },
	line: { default: '#e6e8ee', [DARK]: '#272c37' },
	ink: { default: '#111827', [DARK]: '#eef1f7' },
	muted: { default: '#6b7280', [DARK]: '#98a1b3' },

	positive: { default: '#16a34a', [DARK]: '#4ade80' },
	danger: { default: '#dc2626', [DARK]: '#f87171' },
	warn: { default: '#d97706', [DARK]: '#fbbf24' },
	target: { default: '#d97706', [DARK]: '#fbbf24' },

	positiveSoft: { default: 'rgba(22, 163, 74, 0.10)', [DARK]: 'rgba(74, 222, 128, 0.16)' },
	dangerSoft: { default: 'rgba(220, 38, 38, 0.10)', [DARK]: 'rgba(248, 113, 113, 0.16)' },
	warnSoft: { default: 'rgba(217, 119, 6, 0.10)', [DARK]: 'rgba(251, 191, 36, 0.16)' },
	neutralSoft: { default: 'rgba(17, 24, 39, 0.05)', [DARK]: 'rgba(238, 241, 247, 0.10)' },
	overlay: { default: 'rgba(17, 24, 39, 0.35)', [DARK]: 'rgba(0, 0, 0, 0.55)' },
	hover: { default: '#f1f3f7', [DARK]: '#1f242e' },
})

export const space = stylex.defineVars({
	xs: '4px',
	sm: '8px',
	md: '12px',
	lg: '16px',
	xl: '20px',
	xxl: '24px',
})

export const radius = stylex.defineVars({
	sm: '6px',
	md: '8px',
	lg: '10px',
	xl: '12px',
	pill: '999px',
})

export const text = stylex.defineVars({
	label: '12px',
	body: '14px',
	subTitle: '16px',
	title: '24px',
	display: '30px',
})

export const shadow = stylex.defineVars({
	card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
	panel: '-8px 0 24px rgba(16, 24, 40, 0.18)',
})

export const layout = stylex.defineVars({
	maxWidth: '1400px',
	panelWidth: '440px',
	dialogWidth: '520px',
})
