import type { OverlayPresentation } from '@shared/components/ui/OverlayPanel'

const PRESENTATIONS: readonly OverlayPresentation[] = ['drawer', 'dialog']

function readPresentation(value: string | undefined, fallback: OverlayPresentation): OverlayPresentation {
	return PRESENTATIONS.includes(value as OverlayPresentation) ? (value as OverlayPresentation) : fallback
}

/**
 * Application-level configuration. Values come from the environment so a
 * deployment can change presentation without a code change; anything
 * unrecognised falls back to the documented default.
 *
 * VITE_USER_FORM_PRESENTATION: "dialog" (default) | "drawer"
 */
export const appConfig = {
	userFormPresentation: readPresentation(import.meta.env.VITE_USER_FORM_PRESENTATION, 'dialog'),
} as const
