import type { Account, DashboardData, Kpi, RevenuePoint, User, UserRole } from '@/types'

/**
 * The mock database. This is the only place in the app that knows about
 * public/data.json — everything else talks HTTP. Users are mutable and written
 * through to localStorage; the dashboard payload is read-only.
 */

const USERS_STORAGE_KEY = 'pulseboard.users'

export interface NewUserPayload {
	name: string
	email: string
	role: UserRole
	team: string
}

export type UpdateUserPayload = Partial<NewUserPayload>

interface Database {
	meta: DashboardData['meta']
	kpis: Kpi[]
	revenueSeries: RevenuePoint[]
	accounts: Account[]
	users: User[]
}

let database: Database | null = null

async function seed(): Promise<Database> {
	const response = await fetch('/data.json')
	if (!response.ok) throw new Error(`Unable to seed the mock database: ${response.status}`)
	const seedData = (await response.json()) as DashboardData

	return {
		meta: seedData.meta,
		kpis: seedData.kpis,
		revenueSeries: seedData.revenueSeries,
		accounts: seedData.accounts,
		users: readPersistedUsers() ?? seedData.users,
	}
}

/** Idempotent: repeated calls resolve against the same instance. */
export async function getDatabase(): Promise<Database> {
	if (!database) database = await seed()
	return database
}

function readPersistedUsers(): User[] | null {
	try {
		const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw) as User[]
		return Array.isArray(parsed) ? parsed : null
	} catch {
		// A private window or blocked site data is not an error worth reporting;
		// the seed data is a perfectly good fallback.
		return null
	}
}

function persistUsers(users: User[]): void {
	try {
		window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
	} catch {
		// Persistence is a bonus, never a requirement. Swallow quietly.
	}
}

export async function listUsers(): Promise<User[]> {
	const { users } = await getDatabase()
	return users
}

/** The server owns id, status and lastLoginAt — the form never sends them. */
export async function createUser(payload: NewUserPayload): Promise<User> {
	const db = await getDatabase()
	const created: User = {
		id: nextUserId(db.users),
		name: payload.name,
		email: payload.email,
		role: payload.role,
		team: payload.team,
		status: 'Invited',
		createdAt: new Date().toISOString().slice(0, 10),
		lastLoginAt: null,
	}
	db.users = [...db.users, created]
	persistUsers(db.users)
	return created
}

export async function updateUser(userId: string, payload: UpdateUserPayload): Promise<User | null> {
	const db = await getDatabase()
	const existing = db.users.find((user) => user.id === userId)
	if (!existing) return null

	const updated: User = { ...existing, ...payload }
	db.users = db.users.map((user) => (user.id === userId ? updated : user))
	persistUsers(db.users)
	return updated
}

export async function deleteUser(userId: string): Promise<boolean> {
	const db = await getDatabase()
	const remaining = db.users.filter((user) => user.id !== userId)
	if (remaining.length === db.users.length) return false

	db.users = remaining
	persistUsers(db.users)
	return true
}

function nextUserId(users: User[]): string {
	const highest = users.reduce((max, user) => {
		const numeric = Number(user.id.replace(/\D/g, ''))
		return Number.isFinite(numeric) && numeric > max ? numeric : max
	}, 0)
	return `usr-${String(highest + 1).padStart(3, '0')}`
}
