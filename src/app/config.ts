import type { OverlayPresentation } from '@shared/components/ui/OverlayPanel'

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
 * VITE_AUTH_ENABLED:           "false" (default) | "true"
 *
 * The auth gate defaults to off because tests/acceptance.spec.ts loads "/" and
 * expects the dashboard with no sign-in step, and that file must not be edited.
 */
export const appConfig = {
	userFormPresentation: readPresentation(import.meta.env.VITE_USER_FORM_PRESENTATION, 'dialog'),
	authEnabled: readBoolean(import.meta.env.VITE_AUTH_ENABLED, false),
} as const
