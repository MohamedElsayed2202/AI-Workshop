/**
 * Playwright's strict mode allows exactly one error element per form, while the
 * design shows the message inline under its field. Both hold if only the first
 * errored field in a fixed order carries the test hook.
 */
export function findFirstErroredField<TField extends string>(
	fieldOrder: readonly TField[],
	erroredFields: readonly string[],
): TField | null {
	return fieldOrder.find((field) => erroredFields.includes(field)) ?? null
}
