import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@shared/components/ui/Button'
import { Select } from '@shared/components/ui/Select'
import { OverlayPanel, type OverlayPresentation } from '@shared/components/ui/OverlayPanel'
import { TextField } from '@shared/components/ui/TextField'
import { FIELD_ORDER, USER_ROLES, userFormSchema, type UserFormValues } from '../schemas'
import { findFirstErroredField } from '@shared/helpers/forms'
import { userToFormValues } from '../utils'
import type { User } from '@/types'

interface UserFormViewProps {
	presentation: OverlayPresentation
	user: User | null
	isSaving: boolean
	onSubmit: (values: UserFormValues) => void
	onClose: () => void
}

/** Owns the form. No data hooks live here — the container passes everything in. */
export function UserFormView({ presentation, user, isSaving, onSubmit, onClose }: UserFormViewProps) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<UserFormValues>({
		resolver: yupResolver(userFormSchema),
		defaultValues: userToFormValues(user),
		mode: 'onSubmit',
	})

	const erroredField = findFirstErroredField(FIELD_ORDER, Object.keys(errors))

	const errorProps = (field: keyof UserFormValues) => ({
		message: errors[field]?.message,
		isPrimary: erroredField === field,
	})

	return (
		<OverlayPanel
			presentation={presentation}
			testId="user-form-panel"
			closeTestId="user-form-close"
			eyebrow={user ? 'Edit user' : 'Add user'}
			title={user ? user.name : 'New user'}
			onClose={onClose}
		>
			<form data-testid="user-form" noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<div>
							<TextField label="Name" hasError={Boolean(errors.name)} {...field} />
							<FieldError {...errorProps('name')} />
						</div>
					)}
				/>

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<div>
							<TextField label="Email" hasError={Boolean(errors.email)} {...field} />
							<FieldError {...errorProps('email')} />
						</div>
					)}
				/>

				<Controller
					control={control}
					name="role"
					render={({ field }) => (
						<div>
							<Select label="Role" options={USER_ROLES} hasError={Boolean(errors.role)} {...field} />
							<FieldError {...errorProps('role')} />
						</div>
					)}
				/>

				<Controller
					control={control}
					name="team"
					render={({ field }) => (
						<div>
							<TextField label="Team" hasError={Boolean(errors.team)} {...field} />
							<FieldError {...errorProps('team')} />
						</div>
					)}
				/>

				<div className="mt-2 flex justify-end gap-2">
					<Button variant="outlined" data-testid="user-cancel" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" data-testid="user-save" disabled={isSaving}>
						{user ? 'Save changes' : 'Create user'}
					</Button>
				</div>
			</form>
		</OverlayPanel>
	)
}

function FieldError({ message, isPrimary }: { message?: string; isPrimary: boolean }) {
	if (!message) return null
	return (
		<p data-testid={isPrimary ? 'form-error' : undefined} className="mt-1.5 text-body text-danger">
			{message}
		</p>
	)
}
