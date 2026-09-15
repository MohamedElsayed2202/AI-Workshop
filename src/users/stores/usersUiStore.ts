import { createStore } from '@shared/stores/createStore'
import type { User } from '@/types'

/**
 * UI state only — which overlay is open and what it is acting on. The user
 * records themselves are server state and live in the query cache.
 */
interface UsersUiState {
	editingUser: User | null
	isFormOpen: boolean
	userPendingDeletion: User | null
	openCreateForm: () => void
	openEditForm: (user: User) => void
	closeForm: () => void
	requestDeletion: (user: User) => void
	cancelDeletion: () => void
}

export const useUsersUiStore = createStore<UsersUiState>((set) => ({
	editingUser: null,
	isFormOpen: false,
	userPendingDeletion: null,

	openCreateForm: () =>
		set((state) => {
			state.editingUser = null
			state.isFormOpen = true
		}),

	openEditForm: (user) =>
		set((state) => {
			state.editingUser = user
			state.isFormOpen = true
		}),

	closeForm: () =>
		set((state) => {
			state.editingUser = null
			state.isFormOpen = false
		}),

	requestDeletion: (user) =>
		set((state) => {
			state.userPendingDeletion = user
		}),

	cancelDeletion: () =>
		set((state) => {
			state.userPendingDeletion = null
		}),
}))
