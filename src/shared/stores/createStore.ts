import { create, type StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

/**
 * Project-standard Zustand factory: every store gets Immer so actions can be
 * written as straightforward mutations of a draft.
 */
export function createStore<TState>(initializer: StateCreator<TState, [['zustand/immer', never]], []>) {
	return create<TState>()(immer(initializer))
}
