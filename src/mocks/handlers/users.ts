import { http, HttpResponse } from 'msw'
import { createUser, deleteUser, listUsers, updateUser, type NewUserPayload, type UpdateUserPayload } from '../db'

export const usersHandlers = [
	http.get('/api/users', async () => HttpResponse.json(await listUsers())),

	http.post('/api/users', async ({ request }) => {
		const payload = (await request.json()) as NewUserPayload
		return HttpResponse.json(await createUser(payload), { status: 201 })
	}),

	http.patch('/api/users/:userId', async ({ params, request }) => {
		const payload = (await request.json()) as UpdateUserPayload
		const updated = await updateUser(String(params.userId), payload)
		if (!updated) return new HttpResponse(null, { status: 404 })
		return HttpResponse.json(updated)
	}),

	http.delete('/api/users/:userId', async ({ params }) => {
		const removed = await deleteUser(String(params.userId))
		if (!removed) return new HttpResponse(null, { status: 404 })
		return new HttpResponse(null, { status: 204 })
	}),
]
