import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_STORAGE_KEY, type Language } from '@shared/i18n/i18n'

export function useLanguage() {
	const { i18n } = useTranslation()
	const language: Language = i18n.language === 'fr' ? 'fr' : 'en'

	const setLanguage = useCallback(
		(next: Language) => {
			i18n.changeLanguage(next)
			try {
				window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
			} catch {
				// Remembering the choice is a convenience, not a requirement.
			}
		},
		[i18n],
	)

	const toggleLanguage = useCallback(() => {
		setLanguage(language === 'en' ? 'fr' : 'en')
	}, [language, setLanguage])

	return { language, setLanguage, toggleLanguage }
}
