import { Elysia, t } from "elysia"
import { MKNoteToMasto } from "../converters/note"
import { MKUserToMasto } from "../converters/user"
import { MKUserI } from "../types/useri"
import cors from "@elysiajs/cors"

const instance = process.env.INSTANCE as string

export const accounts = new Elysia()

accounts.use(cors()) // fix?

accounts.get("/api/v1/accounts/:id", async ({ request, headers, params, query, set }) => {
	const { id } = params
	const { authorization } = headers

	const req = await fetch(`https://${instance}/api/users/show`, {
		method: "POST",
		headers: {
            "Authorization": authorization!, // "Bearer " + process.env.DEV_BEARER,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
			userId: id
		})
	})

	const res = await req.json()


	return MKUserToMasto(res, instance)
})


accounts.get("/api/v1/accounts/:id/statuses", async ({ request, headers, params, query, set }) => {
	const { limit, exclude_replies, since_id, until_id, max_id } = query
	const { id } = params
	const { authorization } = headers

	let body: any = {
		userId: id,
		limit: parseInt(limit!) || 10,
	}

	if (since_id) body.sinceId = since_id
	if (until_id) body.untilId = until_id
	if (max_id) body.untilId = max_id

	if (exclude_replies) body.withReplies = (exclude_replies == "true")

	const req = await fetch(`https://${instance}/api/users/notes`, {
		method: "POST",
		headers: {
            "Authorization": authorization!, // "Bearer " + process.env.DEV_BEARER,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
	})

	const res = await req.json()

	let items: any[] = []

	// console.log(params, query)

	for (let item of res) {
		items.push(MKNoteToMasto(item, instance))
	}

	let tempQuery = query

	delete tempQuery.max_id
	delete tempQuery.min_id

	let searchParams = new URLSearchParams(tempQuery as any)

	let base = `https://${new URL(request.url).hostname}/api/v1/accounts/${id}/statuses?${searchParams}`

	if (items.length != 0) set.headers.link = `<${base}&max_id=${items[items.length - 1].id}>; rel="next", <${base}&min_id=${items[0].id}>; rel="prev"`
	set.headers["access-control-expose-headers"] += ", link"

	return items
})

accounts.get("/api/v1/accounts/verify_credentials", async ({ headers, request }) => {
	// console.log("VERIFY CREDS")
	const { authorization } = headers

	// console.log(auth)

	const req = await fetch(`https://${instance}/api/i`, {
		method: "POST",
		headers: {
			"Authorization": authorization, //"Bearer " + process.env.DEV_BEARER!,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ doesnt: "matter" })
	})

	// console.log(req)

	const res = await req.json() as MKUserI

	// console.log(res)

	return MKUserToMasto(res, instance)
}, {
	headers: t.Object({
		authorization: t.String()
	})
})