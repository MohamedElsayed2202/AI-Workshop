import * as yup from 'yup'
import type { TFunction } from 'i18next'
import type { UserRole } from '@/types'

export const USER_ROLES = ['Admin', 'Manager', 'Viewer'] as const satisfies readonly UserRole[]

/** Kept deliberately loose — "looks like an email" is the stated requirement. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function buildUserFormSchema(t: TFunction) {
	return yup.object({
		name: yup.string().trim().required(t('userForm.nameRequired')),
		email: yup
			.string()
			.trim()
			.matches(EMAIL_PATTERN, t('userForm.emailInvalid'))
			.required(t('userForm.emailInvalid')),
		role: yup.string().oneOf(USER_ROLES).required(),
		team: yup.string().trim().defined(),
	})
}

export type UserFormValues = yup.InferType<ReturnType<typeof buildUserFormSchema>>

/** The field order that decides which inline message carries the form-error hook. */
export const FIELD_ORDER = ['name', 'email', 'role', 'team'] as const satisfies readonly (keyof UserFormValues)[]
