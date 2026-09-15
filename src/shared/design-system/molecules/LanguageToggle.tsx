import * as stylex from '@stylexjs/stylex'
import { useTranslation } from 'react-i18next'
import { colors, radius, space, text } from '@shared/design/tokens.stylex'
import { useLanguage } from '@shared/hooks/useLanguage'

export function LanguageToggle() {
	const { t } = useTranslation()
	const { language, toggleLanguage } = useLanguage()
	const isFrench = language === 'fr'

	return (
		<button
			type="button"
			onClick={toggleLanguage}
			aria-pressed={isFrench}
			aria-label={isFrench ? t('language.switchToEnglish') : t('language.switchToFrench')}
			title={isFrench ? t('language.switchToEnglish') : t('language.switchToFrench')}
			data-testid="language-toggle"
			{...stylex.props(styles.toggle)}
		>
			{isFrench ? 'FR' : 'EN'}
		</button>
	)
}

const styles = stylex.create({
	toggle: {
		alignItems: 'center',
		backgroundColor: { default: colors.surface, ':hover': colors.hover },
		borderColor: colors.line,
		borderRadius: radius.md,
		borderStyle: 'solid',
		borderWidth: '1px',
		color: { default: colors.muted, ':hover': colors.ink },
		cursor: 'pointer',
		display: 'flex',
		flexShrink: 0,
		fontSize: text.body,
		fontWeight: 600,
		height: '40px',
		justifyContent: 'center',
		minWidth: '40px',
		paddingInline: space.xs,
		outline: { default: 'none', ':focus-visible': `2px solid ${colors.brand}` },
		outlineOffset: '2px',
	},
})
