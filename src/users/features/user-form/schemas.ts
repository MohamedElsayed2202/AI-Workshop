import * as yup from 'yup'
import type { UserRole } from '@/types'

export const USER_ROLES = ['Admin', 'Manager', 'Viewer'] as const satisfies readonly UserRole[]

export const VALIDATION_MESSAGES = {
	name: 'Enter a name.',
	email: 'Enter a valid email address.',
}

/** Kept deliberately loose — "looks like an email" is the stated requirement. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const userFormSchema = yup.object({
	name: yup.string().trim().required(VALIDATION_MESSAGES.name),
	email: yup.string().trim().matches(EMAIL_PATTERN, VALIDATION_MESSAGES.email).required(VALIDATION_MESSAGES.email),
	role: yup.string().oneOf(USER_ROLES).required(),
	team: yup.string().trim().defined(),
})

export type UserFormValues = yup.InferType<typeof userFormSchema>

/** The field order that decides which inline message carries the form-error hook. */
export const FIELD_ORDER = ['name', 'email', 'role', 'team'] as const satisfies readonly (keyof UserFormValues)[]
