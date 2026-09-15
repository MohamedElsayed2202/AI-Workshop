import * as stylex from '@stylexjs/stylex'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@shared/design-system/atoms/Button'
import { TextField } from '@shared/design-system/atoms/TextField'
import { FormField } from '@shared/design-system/molecules/FormField'
import { colors, space, text } from '@shared/design/tokens.stylex'
import { findFirstErroredField } from '@shared/helpers/forms'
import { LOGIN_FIELD_ORDER, loginFormSchema, type LoginFormValues } from '../schemas'

interface LoginFormProps {
	isSubmitting: boolean
	rejectionMessage: string | null
	onSubmit: (values: LoginFormValues) => void
}

/** Owns the form only. Credentials are checked by the API, never here. */
export function LoginForm({ isSubmitting, rejectionMessage, onSubmit }: LoginFormProps) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: yupResolver(loginFormSchema),
		defaultValues: { username: '', password: '' },
		mode: 'onSubmit',
	})

	const erroredField = findFirstErroredField(LOGIN_FIELD_ORDER, Object.keys(errors))
	// A rejection owns the error hook when present, so there is only ever one.
	const primaryField = rejectionMessage ? null : erroredField

	return (
		<form data-testid="login-form" noValidate onSubmit={handleSubmit(onSubmit)} {...stylex.props(styles.form)}>
			<Controller
				control={control}
				name="username"
				render={({ field }) => (
					<FormField
						label="Username"
						htmlFor="login-username"
						error={errors.username?.message}
						errorTestId={primaryField === 'username' ? 'login-error' : undefined}
					>
						<TextField
							id="login-username"
							autoComplete="username"
							hasError={Boolean(errors.username) || Boolean(rejectionMessage)}
							{...field}
						/>
					</FormField>
				)}
			/>

			<Controller
				control={control}
				name="password"
				render={({ field }) => (
					<FormField
						label="Password"
						htmlFor="login-password"
						error={errors.password?.message}
						errorTestId={primaryField === 'password' ? 'login-error' : undefined}
					>
						<TextField
							id="login-password"
							type="password"
							autoComplete="current-password"
							hasError={Boolean(errors.password) || Boolean(rejectionMessage)}
							{...field}
						/>
					</FormField>
				)}
			/>

			{rejectionMessage ? (
				<p data-testid="login-error" {...stylex.props(styles.rejection)}>
					{rejectionMessage}
				</p>
			) : null}

			<Button type="submit" fullWidth data-testid="login-submit" disabled={isSubmitting}>
				{isSubmitting ? 'Signing in…' : 'Sign in'}
			</Button>
		</form>
	)
}

const styles = stylex.create({
	form: { display: 'flex', flexDirection: 'column', gap: space.lg },
	rejection: { color: colors.danger, fontSize: text.body, margin: 0 },
})
