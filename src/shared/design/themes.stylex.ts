import * as stylex from '@stylexjs/stylex'
import { colors } from './tokens.stylex'

/**
 * The tokens already carry a `prefers-color-scheme` variant, which covers
 * visitors who never touch the toggle. These themes exist for the explicit
 * choice, and override the media query in both directions.
 */

export const lightTheme = stylex.createTheme(colors, {
	brand: '#4f46e5',
	brandSoft: '#a5b4fc',
	brandTint: '#eef2ff',
	onBrand: '#ffffff',
	page: '#f1f3f7',
	surface: '#ffffff',
	line: '#e6e8ee',
	ink: '#111827',
	muted: '#6b7280',
	positive: '#16a34a',
	danger: '#dc2626',
	warn: '#d97706',
	target: '#d97706',
	positiveSoft: 'rgba(22, 163, 74, 0.10)',
	dangerSoft: 'rgba(220, 38, 38, 0.10)',
	warnSoft: 'rgba(217, 119, 6, 0.10)',
	neutralSoft: 'rgba(17, 24, 39, 0.05)',
	overlay: 'rgba(17, 24, 39, 0.35)',
	hover: '#f1f3f7',
})

export const darkTheme = stylex.createTheme(colors, {
	brand: '#818cf8',
	brandSoft: '#4c51bf',
	brandTint: '#272a4d',
	onBrand: '#0e1117',
	page: '#0e1117',
	surface: '#171b23',
	line: '#272c37',
	ink: '#eef1f7',
	muted: '#98a1b3',
	positive: '#4ade80',
	danger: '#f87171',
	warn: '#fbbf24',
	target: '#fbbf24',
	positiveSoft: 'rgba(74, 222, 128, 0.16)',
	dangerSoft: 'rgba(248, 113, 113, 0.16)',
	warnSoft: 'rgba(251, 191, 36, 0.16)',
	neutralSoft: 'rgba(238, 241, 247, 0.10)',
	overlay: 'rgba(0, 0, 0, 0.55)',
	hover: '#1f242e',
})
