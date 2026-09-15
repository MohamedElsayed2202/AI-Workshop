import * as yup from 'yup'
import type { TFunction } from 'i18next'

export function buildLoginFormSchema(t: TFunction) {
	return yup.object({
		username: yup.string().trim().required(t('login.usernameRequired')),
		password: yup.string().required(t('login.passwordRequired')),
	})
}

export type LoginFormValues = yup.InferType<ReturnType<typeof buildLoginFormSchema>>

/** The field order that decides which inline message carries the error hook. */
export const LOGIN_FIELD_ORDER = ['username', 'password'] as const
