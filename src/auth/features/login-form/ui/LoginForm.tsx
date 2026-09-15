import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@shared/components/ui/Button'
import { TextField } from '@shared/components/ui/TextField'
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
	// The rejection owns the error hook when present, so there is only ever one.
	const primaryField = rejectionMessage ? null : erroredField

	return (
		<form data-testid="login-form" noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<Controller
				control={control}
				name="username"
				render={({ field }) => (
					<div>
						<TextField
							label="Username"
							autoComplete="username"
							data-testid="login-username"
							hasError={Boolean(errors.username) || Boolean(rejectionMessage)}
							{...field}
						/>
						{errors.username?.message ? (
							<FieldMessage isPrimary={primaryField === 'username'}>{errors.username.message}</FieldMessage>
						) : null}
					</div>
				)}
			/>

			<Controller
				control={control}
				name="password"
				render={({ field }) => (
					<div>
						<TextField
							label="Password"
							type="password"
							autoComplete="current-password"
							data-testid="login-password"
							hasError={Boolean(errors.password) || Boolean(rejectionMessage)}
							{...field}
						/>
						{errors.password?.message ? (
							<FieldMessage isPrimary={primaryField === 'password'}>{errors.password.message}</FieldMessage>
						) : null}
					</div>
				)}
			/>

			{rejectionMessage ? <FieldMessage isPrimary>{rejectionMessage}</FieldMessage> : null}

			<Button type="submit" data-testid="login-submit" disabled={isSubmitting} className="mt-2 w-full">
				{isSubmitting ? 'Signing in…' : 'Sign in'}
			</Button>
		</form>
	)
}

function FieldMessage({ children, isPrimary }: { children: string; isPrimary: boolean }) {
	return (
		<p data-testid={isPrimary ? 'login-error' : undefined} className="mt-1.5 text-body text-danger">
			{children}
		</p>
	)
}
