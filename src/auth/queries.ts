import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@shared/api/httpClient'
import { useAuthStore } from './stores/authStore'
import type { LoginPayload, Session } from '@/mocks/handlers/auth'

/** Signs in against the API and stores the returned session. */
export function useLogin() {
	const signIn = useAuthStore((state) => state.signIn)

	return useMutation({
		mutationFn: (payload: LoginPayload) => httpClient.post<Session>('/login', payload),
		onSuccess: signIn,
	})
}
