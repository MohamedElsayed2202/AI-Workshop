import * as yup from 'yup'

export const LOGIN_MESSAGES = {
	username: 'Enter your username.',
	password: 'Enter your password.',
	rejected: 'Incorrect username or password.',
}

export const loginFormSchema = yup.object({
	username: yup.string().trim().required(LOGIN_MESSAGES.username),
	password: yup.string().required(LOGIN_MESSAGES.password),
})

export type LoginFormValues = yup.InferType<typeof loginFormSchema>

/** The field order that decides which inline message carries the error hook. */
export const LOGIN_FIELD_ORDER = ['username', 'password'] as const
