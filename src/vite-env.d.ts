/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** "drawer" (default) | "dialog" — how the create/edit user form is presented. */
	readonly VITE_USER_FORM_PRESENTATION?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
