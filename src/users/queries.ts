import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@shared/api/httpClient'
import type { User, UserRole } from '@/types'

export interface UserPayload {
	name: string
	email: string
	role: UserRole
	team: string
}

const USERS_KEY = ['users'] as const

export const usersQueryOptions = queryOptions({
	queryKey: USERS_KEY,
	queryFn: () => httpClient.get<User[]>('/users'),
})

export function useCreateUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: UserPayload) => httpClient.post<User>('/users', payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
	})
}

export function useUpdateUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ userId, payload }: { userId: string; payload: UserPayload }) =>
			httpClient.patch<User>(`/users/${userId}`, payload),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
	})
}

export function useDeleteUser() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (userId: string) => httpClient.delete(`/users/${userId}`),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
	})
}
