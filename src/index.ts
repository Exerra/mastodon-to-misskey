/*
	DEFINITION GUIDE

	MK = Misskey
	Masto = Mastodon
*/

import { Elysia, redirect } from "elysia";
import { cors } from "@elysiajs/cors"
import { MKUser } from "./types/user";
import { MKUserI } from "./types/useri";
import { isURL } from "./util/isURL";
import { MKTimeline } from "./types/timeline";
import { MKUserToMasto } from "./converters/user";
import { MKNoteToMasto } from "./converters/note";

const instance = "daedric.world" // TODO: add to env

const app = new Elysia()

let scopes = [
    "read:account", "write:account", "read:blocks", "write:blocks", "read:drive", "write:drive",
    "read:favorites", "write:favorites", "read:following", "write:following", "read:messaging",
    "write:messaging", "read:mutes", "write:mutes", "write:notes", "read:notifications", "write:notifications",
    "read:reactions", "write:reactions", "write:votes", "read:pages", "write:pages", "write:page-likes",
    "read:page-likes", "read:user-groups", "write:user-groups", "read:channels", "write:channels",
    "read:gallery", "write:gallery", "read:gallery-likes", "write:gallery-likes"
]

app.use(cors())

// app.get("/", () => "Hello Elysia")

app.all("*", async ({ request, body, set }) => {
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

	if (body) init.body = request.body?.toString()

	if (request.headers.get("Authorization")) {
		// TODO: fix
		// @ts-ignore
		init.headers["Authorization"] = "Bearer " + process.env.DEV_BEARER //request.headers.get("Authorization")!
	}

	console.log(url.toString())

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

	return bodya
})

app.get("/api/v1/preferences", async ({ request, redirect }) => {
	let id = "dcxF5rDO9R5dfxpd" // TODO: dynamically get the logged in users ID with the /api/i endpoint

	const req = await fetch(`https://${instance}/api/v1/preferences`, {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + process.env.DEV_BEARER,
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
})

app.get("/api/v1/accounts/verify_credentials", async ({ request, redirect }) => {
	const auth = request.headers.get("Authorization")

	const req = await fetch(`https://${instance}/api/i`, {
		method: "POST",
		headers: {
			"Authorization": auth!, //"Bearer " + process.env.DEV_BEARER!,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ doesnt: "matter" })
	})
	const res = await req.json() as MKUserI

	return MKUserToMasto(res, instance)
})

app.get("/api/v1/timelines/home", async ({ request, query }) => {
	const { limit, since_id, until_id } = query

	let body: any = {
		limit: parseInt(limit!) || 10
	}

	if (since_id) body.sinceId = since_id
	if (until_id) body.untilId = until_id

	// ! Hybrid timeline for testing as it has more activity
	const req = await fetch(`https://${instance}/api/notes/hybrid-timeline`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + process.env.DEV_BEARER,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

	const res = await req.json() as MKTimeline

	let items: any[] = []

	for (let item of res) {
		items.push(MKNoteToMasto(item, instance))
	}

	return items
})


// Redirects to the instance OAuth screen with the same params. Very important. Does not work otherwise.
app.get("/oauth/authorize", async ({ request, redirect }) => {
	let url = new URL(request.url)

	url.hostname = instance

	return redirect(url.toString())
})

app.get("/.well-known/oauth-authorization-server", async () => {
	const req = await fetch(`https://${instance}/.well-known/oauth-authorization-server`)
	const res = await req.json()

	return res
})

app.get("/.well-known/host-meta", async ({ request }) => {
	const hostname = new URL(request.url).hostname

	const req = await fetch(`https://${instance}/.well-known/host-meta`)
	let res = await req.text()

	res = res.replaceAll(instance, hostname) // Otherwise well coded apps use the domain provided by the above endpoint rather than what was inputted by the user (example: Phanpy)

	return res
})

// TODO: Uses the Sharkey MK to Masto impl., need to figure out MK native
app.post("/api/v1/apps", async ({ body }) => {
	// const req = await fetch(`https://${instance}/oauth/token`, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json"
	// 	},
	// 	body: JSON.stringify({
	// 		name: body.client_name,
	// 		description: "Proxy",
	// 		permission: scopes
	// 	})
	// })
	// console.log(body)

	// console.log(body)

	const req = await fetch(`https://${instance}/api/v1/apps`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	})

	return await req.json()
})

// TODO: Uses the Sharkey MK to Masto impl., need to figure out MK native
app.post("/oauth/token", async ({ body }) => {
	const req = await fetch(`https://${instance}/oauth/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	})
	let res = await req.json()

	return res
})

app.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
