import type { OverlayPresentation } from '@shared/design-system/molecules/Modal'

const PRESENTATIONS: readonly OverlayPresentation[] = ['drawer', 'dialog']

function readPresentation(value: string | undefined, fallback: OverlayPresentation): OverlayPresentation {
	return PRESENTATIONS.includes(value as OverlayPresentation) ? (value as OverlayPresentation) : fallback
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
	if (value === 'true') return true
	if (value === 'false') return false
	return fallback
}

/**
 * Application-level configuration. Values come from the environment so a
 * deployment can change behaviour without a code change; anything unrecognised
 * falls back to the documented default.
 *
 * VITE_USER_FORM_PRESENTATION: "dialog" (default) | "drawer"
 * VITE_AUTH_ENABLED:           "true" (default) | "false"
 *
 * The auth gate is on by default: an unauthenticated visitor is redirected to
 * /login. Note that tests/acceptance.spec.ts loads "/" and expects the dashboard
 * with no sign-in step, so that suite must be run with VITE_AUTH_ENABLED=false.
 */
export const appConfig = {
	userFormPresentation: readPresentation(import.meta.env.VITE_USER_FORM_PRESENTATION, 'dialog'),
	authEnabled: readBoolean(import.meta.env.VITE_AUTH_ENABLED, true),
} as const
