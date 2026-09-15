import * as stylex from '@stylexjs/stylex'

/**
 * Breakpoints, matching the three viewports the design was drawn for.
 *
 * These are compile-time constants rather than plain strings: StyleX inlines
 * them into the generated CSS, and only resolves such values from a `.stylex`
 * file.
 */
export const breakpoint = stylex.defineConsts({
	sm: '@media (min-width: 600px)',
	lg: '@media (min-width: 1280px)',
})
