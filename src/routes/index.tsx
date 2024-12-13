import { Elysia } from "elysia"
import { html, Html } from '@elysiajs/html'

const instance = process.env.INSTANCE as string

export const index = new Elysia()
index.use(html())

const Code = ({ text }: { text: string }) => {
    return (
        <code style={{ backgroundColor: "#2E3440", color: "#D8DEE9", padding: "2px", borderRadius: "5px" }}>{text}</code>
    )
}

index.get("/", ({ request }) => {
    const url = new URL(request.url)
    const hostname = url.hostname

    return (
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Mastodon to Misskey bridge</title>
        </head>
        <body style={{ textAlign: "center", fontFamily: "sans-serif" }}>
            <h1>Mastodon to Misskey bridge</h1>
            <p>This bridge is configured to bridge <Code text={instance} />.</p>
            <h2>What is this?</h2>
            <p>This is a bridge that lets you use Mastodon applications/tools with Misskey (& its forks) instances.</p>
            <p>THIS BRIDGE IS IN ACTIVE DEVELOPMENT AND <b>CURRENTLY</b> ONLY SUPPORTS SHARKEY</p>
            <p>Why Sharkey? They implement parts of the API already and the OAuth API has not yet been added in the bridge. If you can help, please contribute to the repo: <a href="https://github.com/Exerra/mastodon-to-misskey">Exerra/mastodon-to-misskey</a></p>
            <h2>How to use the bridge</h2>
            <p>When logging into a Mastodon application, type in <Code text={hostname} /> as the instance URL instead of <Code text={instance} /></p>
        </body>
        </html>
    )
})