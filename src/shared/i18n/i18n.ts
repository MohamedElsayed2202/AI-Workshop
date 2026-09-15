import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'

export type Language = 'en' | 'fr'

export const LANGUAGE_STORAGE_KEY = 'pulseboard.language'

function readStoredLanguage(): Language {
	try {
		const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
		return stored === 'fr' ? 'fr' : 'en'
	} catch {
		return 'en'
	}
}

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		fr: { translation: fr },
	},
	lng: readStoredLanguage(),
	fallbackLng: 'en',
	interpolation: { escapeValue: false },
})

// Keeps the document's lang attribute correct on first load and every toggle.
document.documentElement.lang = i18n.language
i18n.on('languageChanged', (language) => {
	document.documentElement.lang = language
})

export default i18n
