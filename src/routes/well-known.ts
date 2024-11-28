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

wellKnown.get("/.well-known/nodeinfo", ({ request }) => {
	return {
		links: [
			{
				rel: "http://nodeinfo.diaspora.software/ns/schema/2.0",
				href: `https://${new URL(request.url).hostname}/nodeinfo/2.0`
			}
		]
	}
})

// ! --------------------------------- NEED TO FIX ---------------------------------

wellKnown.get("/nodeinfo/2.0", () => {
	return {
		"version": "2.0",
		"software": {
			"name": "mastodon",
			"version": "4.4.0-nightly.2024-11-23"
		},
		"protocols": [
			"activitypub"
		],
		"services": {
			"outbound": [],
			"inbound": []
		},
		"usage": {
			"users": {
				"total": 2229283,
				"activeMonth": 276137,
				"activeHalfyear": 627488
			},
			"localPosts": 111318091
		},
		"openRegistrations": true,
		"metadata": {
			"nodeName": "Mastodon",
			"nodeDescription": "The original server operated by the Mastodon gGmbH non-profit"
		}
	}
})

wellKnown.get("/api/v2/instance", ({ request }) => {
	return {
		"domain": "mastodon.social",
		"title": "Mastodon",
		"version": "4.4.0-nightly.2024-11-23",
		"source_url": "https://github.com/mastodon/mastodon",
		"description": "The original server operated by the Mastodon gGmbH non-profit",
		"usage": {
			"users": {
				"active_month": 276137
			}
		},
		"thumbnail": {
			"url": "https://files.mastodon.social/site_uploads/files/000/000/001/@1x/57c12f441d083cde.png",
			"blurhash": "UeKUpFxuo~R%0nW;WCnhF6RjaJt757oJodS$",
			"versions": {
				"@1x": "https://files.mastodon.social/site_uploads/files/000/000/001/@1x/57c12f441d083cde.png",
				"@2x": "https://files.mastodon.social/site_uploads/files/000/000/001/@2x/57c12f441d083cde.png"
			}
		},
		"icon": [
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-36x36-4c61fdb42936428af85afdbf8c6a45a8.png",
				"size": "36x36"
			},
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-48x48-2027aead76dc906c981043d658a8258d.png",
				"size": "48x48"
			},
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-72x72-799d90b81f5b28cea7355a0c0b356381.png",
				"size": "72x72"
			},
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-96x96-c2dfcfa1268c56e59edddfe20d818b91.png",
				"size": "96x96"
			},
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-144x144-ff3110f7772743bdd0c1c47fb7b2d4e0.png",
				"size": "144x144"
			},
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-192x192-eddc1ed540e97b926202b7b857989d60.png",
				"size": "192x192"
			},
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-256x256-7b2b43926019259f7c9ddee627d80a0f.png",
				"size": "256x256"
			},
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-384x384-72068ed50b02828fc505a8d69b321dea.png",
				"size": "384x384"
			},
			{
				"src": "https://mastodon.social/packs/media/icons/android-chrome-512x512-ccb53c9fcbb5f61bf741cc54998318f0.png",
				"size": "512x512"
			}
		],
		"languages": [
			"en"
		],
		"configuration": {
			"urls": {
				"streaming": `wss://${instance}/streaming`,
				"status": "https://status.mastodon.social"
			},
			"vapid": {
				"public_key": "BCk-QqERU0q-CfYZjcuB6lnyyOYfJ2AifKqfeGIm7Z-HiTU5T9eTG5GxVA0_OH5mMlI4UkkDTpaZwozy0TzdZ2M="
			},
			"accounts": {
				"max_featured_tags": 10,
				"max_pinned_statuses": 5
			},
			"statuses": {
				"max_characters": 500,
				"max_media_attachments": 4,
				"characters_reserved_per_url": 23
			},
			"media_attachments": {
				"supported_mime_types": [
					"image/jpeg",
					"image/png",
					"image/gif",
					"image/heic",
					"image/heif",
					"image/webp",
					"image/avif",
					"video/webm",
					"video/mp4",
					"video/quicktime",
					"video/ogg",
					"audio/wave",
					"audio/wav",
					"audio/x-wav",
					"audio/x-pn-wave",
					"audio/vnd.wave",
					"audio/ogg",
					"audio/vorbis",
					"audio/mpeg",
					"audio/mp3",
					"audio/webm",
					"audio/flac",
					"audio/aac",
					"audio/m4a",
					"audio/x-m4a",
					"audio/mp4",
					"audio/3gpp",
					"video/x-ms-asf"
				],
				"image_size_limit": 16777216,
				"image_matrix_limit": 33177600,
				"video_size_limit": 103809024,
				"video_frame_rate_limit": 120,
				"video_matrix_limit": 8294400
			},
			"polls": {
				"max_options": 4,
				"max_characters_per_option": 50,
				"min_expiration": 300,
				"max_expiration": 2629746
			},
			"translation": {
				"enabled": true
			}
		},
		"registrations": {
			"enabled": true,
			"approval_required": false,
			"message": null,
			"url": null
		},
		"api_versions": {
			"mastodon": 2
		},
		"contact": {
			"email": "staff@mastodon.social",
			"account": {
				"id": "13179",
				"username": "Mastodon",
				"acct": "Mastodon",
				"display_name": "Mastodon",
				"locked": false,
				"bot": false,
				"discoverable": true,
				"indexable": false,
				"group": false,
				"created_at": "2016-11-23T00:00:00.000Z",
				"note": "\u003cp\u003eFree, open-source decentralized social media platform.\u003c/p\u003e",
				"url": "https://mastodon.social/@Mastodon",
				"uri": "https://mastodon.social/users/Mastodon",
				"avatar": "https://files.mastodon.social/accounts/avatars/000/013/179/original/b4ceb19c9c54ec7e.png",
				"avatar_static": "https://files.mastodon.social/accounts/avatars/000/013/179/original/b4ceb19c9c54ec7e.png",
				"header": "https://files.mastodon.social/accounts/headers/000/013/179/original/1375be116fbe0f1d.png",
				"header_static": "https://files.mastodon.social/accounts/headers/000/013/179/original/1375be116fbe0f1d.png",
				"followers_count": 822806,
				"following_count": 4,
				"statuses_count": 272,
				"last_status_at": "2024-10-21",
				"hide_collections": false,
				"noindex": false,
				"emojis": [],
				"roles": [],
				"fields": [
					{
						"name": "Homepage",
						"value": "\u003ca href=\"https://joinmastodon.org\" target=\"_blank\" rel=\"nofollow noopener noreferrer me\" translate=\"no\"\u003e\u003cspan class=\"invisible\"\u003ehttps://\u003c/span\u003e\u003cspan class=\"\"\u003ejoinmastodon.org\u003c/span\u003e\u003cspan class=\"invisible\"\u003e\u003c/span\u003e\u003c/a\u003e",
						"verified_at": "2018-10-31T04:11:00.076+00:00"
					},
					{
						"name": "Patreon",
						"value": "\u003ca href=\"https://patreon.com/mastodon\" target=\"_blank\" rel=\"nofollow noopener noreferrer me\" translate=\"no\"\u003e\u003cspan class=\"invisible\"\u003ehttps://\u003c/span\u003e\u003cspan class=\"\"\u003epatreon.com/mastodon\u003c/span\u003e\u003cspan class=\"invisible\"\u003e\u003c/span\u003e\u003c/a\u003e",
						"verified_at": null
					},
					{
						"name": "GitHub",
						"value": "\u003ca href=\"https://github.com/mastodon\" target=\"_blank\" rel=\"nofollow noopener noreferrer me\" translate=\"no\"\u003e\u003cspan class=\"invisible\"\u003ehttps://\u003c/span\u003e\u003cspan class=\"\"\u003egithub.com/mastodon\u003c/span\u003e\u003cspan class=\"invisible\"\u003e\u003c/span\u003e\u003c/a\u003e",
						"verified_at": "2023-07-21T13:27:45.996+00:00"
					}
				]
			}
		},
		"rules": [
			{
				"id": "1",
				"text": "Sexually explicit or violent media must be marked as sensitive or with a content warning",
				"hint": "This includes content that is particularly provocative even if it may not show specific body parts, as well as dead bodies, bloody injuries, and other gore. Particularly obscene content may be prohibited entirely. Profile pictures and header images may not contain sexually explicit or violent media."
			},
			{
				"id": "2",
				"text": "No racism, sexism, homophobia, transphobia, ableism, xenophobia, or casteism.",
				"hint": "Transphobic behavior such as intentional misgendering and deadnaming is strictly prohibited. Promotion of \"conversion therapy\" is strictly prohibited. Criticism of governments and religions is permissible unless being used as a proxy for discrimination."
			},
			{
				"id": "3",
				"text": "No incitement of violence or promotion of violent ideologies",
				"hint": "Calling for people or groups to be assassinated, murdered, or attacked physically is strictly prohibited. Support for violent groups or events is prohibited."
			},
			{
				"id": "4",
				"text": "No harassment, block evasion, dogpiling, or doxxing of others",
				"hint": "Repeat attempts to communicate with users who have blocked you or creation of accounts solely to harass or insult individuals is strictly prohibited. Coordinated activity to attack other users is prohibited. Posting of private personal information about others is prohibited."
			},
			{
				"id": "7",
				"text": "Do not share information widely-known to be false and misleading",
				"hint": "False and misleading information and links from low-quality sources may not be posted, especially if they are likely to mislead or confuse others or endanger their safety."
			},
			{
				"id": "1008",
				"text": "Content created by others must be attributed, and use of generative AI must be disclosed",
				"hint": "Content created by others must clearly provide a reference to the author, creator, or source. For adult content, this should include performers. Accounts may not solely post AI-generated content."
			}
		]
	}
})

// ! -------------------------------------------------------------------------------