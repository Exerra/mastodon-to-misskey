import { Elysia } from "elysia"
import { MKNoteToMasto } from "../converters/note"

const instance = process.env.INSTANCE as string

export const statuses = new Elysia()

statuses.get("/api/v1/statuses/:id", async ({ headers, params }) => {
	const { id } = params
	const { authorization } = headers

	const req = await fetch(`https://${instance}/api/notes/show`, {
		method: "POST",
		headers: {
            "Authorization": authorization!,
            "Content-Type": "application/json"
        },
		body: JSON.stringify({
			noteId: id
		})
	})

	const res = await req.json()

	return MKNoteToMasto(res, instance)
})

statuses.get("/api/v1/statuses/:id/context", async ({ request, headers, params, query, set }) => {
	const { authorization } = headers
	const { id } = params
	const { limit } = query


	let body: any = {
		noteId: id,
		limit: parseInt(limit!) || 10,
	}

	// console.log(headers, params, query, body)

	const ascendantReq = await fetch(`https://${instance}/api/notes/conversation`, {
		method: "POST",
		headers: {
            "Authorization": authorization!,
            "Content-Type": "application/json"
        },
		body: JSON.stringify(body)
	})

	const ascendantRes = await ascendantReq.json()

	const descendantReq = await fetch(`https://${instance}/api/notes/children`, {
		method: "POST",
		headers: {
            "Authorization": authorization!,
            "Content-Type": "application/json"
        },
		body: JSON.stringify(body)
	})

	const descendantRes = await descendantReq.json()

	// console.

	let ascend: any[] = []
	let descend: any[] = []

	// console.log(params, query)

	for (let item of ascendantRes) {
		ascend.push(MKNoteToMasto(item, instance))
	}
	for (let item of descendantRes) {
		descend.push(MKNoteToMasto(item, instance))
	}

	return {
		ancestors: ascend.reverse(), // Needed so the history displays in the correct order
		descendants: descend.reverse()
	}
})