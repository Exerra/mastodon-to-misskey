import { Elysia } from "elysia"

const instance = process.env.INSTANCE as string

export const auth = new Elysia()

// TODO: Uses the Sharkey MK to Masto impl., need to figure out MK native
auth.post("/api/v1/apps", async ({ body }) => {
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
auth.post("/oauth/token", async ({ body }) => {
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