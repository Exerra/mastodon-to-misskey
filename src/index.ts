/*
	DEFINITION GUIDE

	MK = Misskey
	Masto = Mastodon
*/

import { Elysia, redirect, t } from "elysia";
import { cors } from "@elysiajs/cors"
import { MKUser } from "./types/user";
import { MKUserI } from "./types/useri";
import { isURL } from "./util/isURL";
import { MKTimeline } from "./types/timeline";
import { MKUserToMasto } from "./converters/user";
import { MKNoteToMasto } from "./converters/note";
import { wellKnown } from "./routes/well-known";
import { auth } from "./routes/auth";
import { notes } from "./routes/note";
import { statuses } from "./routes/statuses";

const instance = process.env.INSTANCE as string

const app = new Elysia()
	.onError(({ error, code, request }) => {
		if (code === "NOT_FOUND") return

		console.error(error, request.url)
	})

app.use(cors())
app.use(wellKnown)
app.use(auth)
app.use(notes)
app.use(statuses)

// app.get("/", () => "Hello Elysia")

app.all("*", async ({ request, body, set, headers }) => {
	const url = new URL(request.url)

	url.hostname = instance
	url.port = ""

	let init: RequestInit = {
		method: request.method,
		headers: {
			"Content-Type": request.headers.get("Content-Type") || "application/json",
			"Host": instance
		}
	}

	// console.log(request)

	if (body) init.body = request.body?.toString()

	if (request.headers.get("Authorization")) {
		// TODO: fix
		// @ts-ignore
		init.headers["Authorization"] =  headers.authorization //"Bearer " + request.headers.get("Authorization")!
	}

	// console.log(headers, init)

	console.log(url.toString(), "url to string")

	// init.headers["x-forwarded-for"] = ""

	const req = await fetch(url.toString(), init)

	for (let key of Object.keys(req.headers)) {
		// TODO: fix
		// @ts-ignore
		let object = req.headers[key]

		set.headers[key] = object
	}

	// set.headers["content-type"] = req.headers.get("Content-Type")

	set.status = req.status

	let bodya: any = ""

	// console.log(req.headers.get("Content-Type"))

	switch (req.headers.get("Content-Type")) {
		case "application/json":
			bodya = await req.json()
			break;
		case "application/json; charset=utf-8": // ? trim charset from header to unify
			bodya = await req.json()
			break;
		default:
			bodya = await req.blob()
			break;
	}

	// console.log(bodya)

	return bodya
})

app.get("/api/v1/notifications", async ({ request, headers, params, query, set }) => {
	// TODO: query filtering
	// const { limit, exclude_replies, since_id, until_id, max_id } = query
	// const { id } = params
	const { authorization } = headers

	const req = await fetch(`https://${instance}/api/i/notifications`, {
		method: "POST",
		headers: {
            "Authorization": authorization!,
            "Content-Type": "application/json"
        },
		body: JSON.stringify({
			limit: 10,
			markAsRead: false
		})
	})

	const res = await req.json()

	const items = []

	for (let item of res) {
		let allowTypes = ["mention", "reply"]
		if (!allowTypes.includes(item.type)) continue

		// console.log(item.user.name)

		let type = item.type
		let typer = item.type

		if (item.type == "reply") await typer == "mention"

		type = "mention"

		let temp = {
			// @ts-ignore
			account: MKUserToMasto(item.user),
			created_at: item.createdAt,
			id: item.id,
			type: type,
			// @ts-ignore
			status: MKNoteToMasto(item.note)
		}

		console.log(item.type, type, typer)

		items.push(temp)
	}

	return items
})

app.get("/api/v1/accounts/:id/statuses", async ({ request, headers, params, query, set }) => {
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

	console.log(params, query)

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

app.get("/api/v1/preferences", async ({ request, redirect, headers }) => {
	const { authorization } = headers

	let id = "dcxF5rDO9R5dfxpd" // TODO: dynamically get the logged in users ID with the /api/i endpoint

	const req = await fetch(`https://${instance}/api/v1/preferences`, {
		method: "POST",
		headers: {
			"Authorization": authorization, //"Bearer " + process.env.DEV_BEARER,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			i: id
		})
	})
	const res = await req.json() as MKUser

	return {
		"posting:default:language": "english", 	// TODO: res.lang (lv-LV) -> posting:default:language (latvian)
		"posting:default:sensitive": res.autoSensitive,
		"posting:default:visibility": "public", 	// ? is there even something like this in Misskey
		"reading:expand:media": "default", 			// ? ^^^^
		"reading:expand:spoilers": false 			// ? ^^^^
	}
}, {
	headers: t.Object({
		authorization: t.String()
	})
})

app.get("/api/v1/accounts/verify_credentials", async ({ request, redirect, headers }) => {
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
	const res = await req.json() as MKUserI

	return MKUserToMasto(res, instance)
}, {
	headers: t.Object({
		authorization: t.String()
	})
})

app.get("/api/v1/timelines/:timeline", async ({ request, query, set, params, headers }) => {
	const { limit, since_id, until_id, max_id } = query
	const { authorization } = headers

	let body: any = {
		limit: parseInt(limit!) || 10,
		// allowPartial: true,
		// withReplies: true,
		// withFiles: true
	}

	if (since_id) body.sinceId = since_id
	if (until_id) body.untilId = until_id
	if (max_id) body.untilId = max_id

	let mkTimeline: "" | "following" | "bubble-timeline" | "hybrid-timeline" | "global-timeline" | "local-timeline" = ""

	switch (params.timeline) {
		case "public":
			if (query.local) mkTimeline = "local-timeline"
			else mkTimeline = "global-timeline"
			break;
		// case "home":
		// 	mkTimeline = "following"
		// 	break;
		default:
			mkTimeline = "hybrid-timeline"
			break;
	}

	const req = await fetch(`https://${instance}/api/notes/${mkTimeline}`, {
        method: "POST",
        headers: {
            "Authorization": authorization, // "Bearer " + process.env.DEV_BEARER,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

	const res = await req.json() as MKTimeline

	let items: any[] = []

	for (let item of res) {
		items.push(MKNoteToMasto(item, instance))
	}

	let tempQuery = query

	delete tempQuery.max_id
	delete tempQuery.min_id

	let searchParams = new URLSearchParams(tempQuery as any)

	let base = `https://${new URL(request.url).hostname}/api/v1/timelines/${params.timeline}?${searchParams}`

	if (items.length != 0) set.headers.link = `<${base}&max_id=${items[items.length - 1].id}>; rel="next", <${base}&min_id=${items[0].id}>; rel="prev"`
	set.headers["access-control-expose-headers"] += ", link"

	return items
}, {
	headers: t.Object({
		authorization: t.String()
	})
})

app.get("/api/:version/:lol", async () => {
	return []
})

let port = 3000

const start = () => {
	try {
		app.listen(port);

		console.log(
			`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
		);
	} catch (e) {
		port++
		start()
	}
}

start()