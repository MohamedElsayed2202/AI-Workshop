import * as stylex from '@stylexjs/stylex'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@shared/design-system/atoms/Button'
import { Select } from '@shared/design-system/atoms/Select'
import { TextField } from '@shared/design-system/atoms/TextField'
import { FormField } from '@shared/design-system/molecules/FormField'
import { Modal, type OverlayPresentation } from '@shared/design-system/molecules/Modal'
import { space } from '@shared/design/tokens.stylex'
import { findFirstErroredField } from '@shared/helpers/forms'
import { FIELD_ORDER, USER_ROLES, userFormSchema, type UserFormValues } from '../schemas'
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

	return (
		<Modal
			presentation={presentation}
			testId="user-form-panel"
			closeTestId="user-form-close"
			eyebrow={user ? 'Edit user' : 'Add user'}
			title={user ? user.name : 'New user'}
			onClose={onClose}
		>
			<form data-testid="user-form" noValidate onSubmit={handleSubmit(onSubmit)} {...stylex.props(styles.form)}>
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<FormField
							label="Name"
							htmlFor="user-name"
							error={errors.name?.message}
							errorTestId={erroredField === 'name' ? 'form-error' : undefined}
						>
							<TextField id="user-name" hasError={Boolean(errors.name)} {...field} />
						</FormField>
					)}
				/>

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<FormField
							label="Email"
							htmlFor="user-email"
							error={errors.email?.message}
							errorTestId={erroredField === 'email' ? 'form-error' : undefined}
						>
							<TextField id="user-email" hasError={Boolean(errors.email)} {...field} />
						</FormField>
					)}
				/>

				<Controller
					control={control}
					name="role"
					render={({ field }) => (
						<FormField
							label="Role"
							htmlFor="user-role"
							error={errors.role?.message}
							errorTestId={erroredField === 'role' ? 'form-error' : undefined}
						>
							<Select id="user-role" options={USER_ROLES} hasError={Boolean(errors.role)} {...field} />
						</FormField>
					)}
				/>

				<Controller
					control={control}
					name="team"
					render={({ field }) => (
						<FormField
							label="Team"
							htmlFor="user-team"
							error={errors.team?.message}
							errorTestId={erroredField === 'team' ? 'form-error' : undefined}
						>
							<TextField id="user-team" hasError={Boolean(errors.team)} {...field} />
						</FormField>
					)}
				/>

				<div {...stylex.props(styles.actions)}>
					<Button variant="outlined" data-testid="user-cancel" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" data-testid="user-save" disabled={isSaving}>
						{user ? 'Save changes' : 'Create user'}
					</Button>
				</div>
			</form>
		</Modal>
	)
}

const styles = stylex.create({
	form: { display: 'flex', flexDirection: 'column', gap: space.lg },
	actions: { display: 'flex', gap: space.sm, justifyContent: 'flex-end', marginTop: space.sm },
})
