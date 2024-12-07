import { Elysia, t } from "elysia"
import { MKNoteToMasto } from "../converters/note"

const instance = process.env.INSTANCE as string

export const notes = new Elysia()

const fetchNote = async (noteId: string, auth: string) => {
    const noteRes = await fetch(`https://${instance}/api/notes/show`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        body: JSON.stringify({
            noteId: noteId
        })
    })

    const noteReq = await noteRes.json() as any

    return MKNoteToMasto(noteReq, instance)
}

notes.post("/api/v1/statuses/:id/reblog", async ({ request, headers, params, body }) => {
    const { authorization } = headers
    const { id } = params

    const res = await fetch(`https://${instance}/api/notes/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        },
        body: JSON.stringify({
            renoteId: id
        })
    })

    const req = await res.json()

    const note = await MKNoteToMasto(req.createdNote as any, instance)

    return note
}, {
    headers: t.Object({
		authorization: t.String()
	}),
    params: t.Object({
        id: t.String(),
    })
})

notes.post("/api/v1/statuses/:id/:action", async ({ request, headers, params }) => {
    const { authorization } = headers
    const { id, action } = params

    // console.log(params)

    let type: any = action

    if (action == "favourite") type = "like"
    // if (action == "unfavourite") type = ""
    if (action == "bookmark") type = "favorites/create"
    if (action == "unbookmark") type = "favorites/delete"
    // if (action == "reblog") type = ""

    const res = await fetch(`https://${instance}/api/notes/${type}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        },
        body: JSON.stringify({
            noteId: id
        })
    })

    const req = await res.json()

    return fetchNote(id, authorization)
}, {
	headers: t.Object({
		authorization: t.String()
	}),
    params: t.Object({
        id: t.String(),
        action: t.Union([
            t.Literal("favourite"),
            // t.Literal("reblog"),
            t.Literal("bookmark"),
            t.Literal("unbookmark")
        ])
    })
})