import type { UserPayload } from '@users/queries'
import type { User, UserRole } from '@/types'
import type { UserFormValues } from './schemas'

export function userToFormValues(user: User | null): UserFormValues {
	return {
		name: user?.name ?? '',
		email: user?.email ?? '',
		role: user?.role ?? 'Viewer',
		team: user?.team ?? '',
	}
}

/** Status, id and lastLoginAt are the server's to assign, so they are not sent. */
export function formValuesToPayload(values: UserFormValues): UserPayload {
	return {
		name: values.name.trim(),
		email: values.email.trim(),
		role: values.role as UserRole,
		team: values.team.trim(),
	}
}

/**
 * Playwright's strict mode allows exactly one form-error element, while the
 * design shows the message inline under its field. Both hold if only the first
 * errored field in a fixed order carries the hook.
 */
export function findFirstErroredField<TField extends string>(
	fieldOrder: readonly TField[],
	erroredFields: readonly string[],
): TField | null {
	return fieldOrder.find((field) => erroredFields.includes(field)) ?? null
}
