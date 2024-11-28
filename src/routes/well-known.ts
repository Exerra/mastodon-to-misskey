import { Elysia } from "elysia"

const instance = process.env.INSTANCE as string

export const wellKnown = new Elysia()

// Redirects to the instance OAuth screen with the same params. Very important. Does not work otherwise.
wellKnown.get("/oauth/authorize", async ({ request, redirect }) => {
	let url = new URL(request.url)

	url.hostname = instance

	return redirect(url.toString())
})

wellKnown.get("/.well-known/oauth-authorization-server", async () => {
	const req = await fetch(`https://${instance}/.well-known/oauth-authorization-server`)
	const res = await req.json()

	return res
})

wellKnown.get("/.well-known/host-meta", async ({ request }) => {
	const hostname = new URL(request.url).hostname

	const req = await fetch(`https://${instance}/.well-known/host-meta`)
	let res = await req.text()

	res = res.replaceAll(instance, hostname) // Otherwise well coded apps use the domain provided by the above endpoint rather than what was inputted by the user (example: Phanpy)

	return res
})