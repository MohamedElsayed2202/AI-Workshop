/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** "dialog" (default) | "drawer" — how the create/edit user form is presented. */
	readonly VITE_USER_FORM_PRESENTATION?: string
	/** "false" (default) | "true" — whether the login gate is enforced. */
	readonly VITE_AUTH_ENABLED?: string
	/** Base URL for the HTTP client. Defaults to "/api" (served by MSW). */
	readonly VITE_API_URL?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
