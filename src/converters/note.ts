import { MKTimelineItem, MKTimelineRenote } from "../types/timeline";
import { MKUserToMasto } from "./user";

export const MKNoteToMasto = (note: MKTimelineItem | MKTimelineRenote, instance: string) => {
    console.log(note.uri)
    let temp: any = {
        id: note.id,
        uri: note.uri,
        url: note.url,
        // @ts-ignore                                           slight hack so it doesnt complain that undefined isnt a url (?????)
        account: MKUserToMasto(note.user, (new URL(note.url || "https://daedric.world")).hostname),
        in_reply_to_id: null,
        in_reply_to_account_id: null,
        reblog: note.renote == null ? null : MKNoteToMasto(note.renote, instance), // ! add
        content: note.text, // TODO: convert MD to html
        content_type: "text/x.misskeymarkdown",
        text: note.text,
        created_at: note.createdAt,
        emojis: [], // ! add
        replies_count: note.repliesCount,
        reblogs_count: note.renoteCount,
        favourites_count: note.reactionCount,
        reblogged: false, // ! add
        favourited: false, // ! add
        muted: false, // ! add
        sensitive: (note.cw != null),
        spoiler_text: note.cw || "",
        visibility: "public",//note.visibility || "public",
        media_attachments: [],
        mentions: [], // ! add
        tags: [],
        card: null,
        poll: null,
        application: null,
        language: null,
        pinned: false,
        reactions: [],
        emoji_reactions: [],
        bookmarked: false,
        quote: null,
        edited_at: (note as MKTimelineItem).updatedAt || null
    }

    if (note.user.username == "exerra") {
        console.log(note)
    }

    if (note.replyId != null) {
        temp.in_reply_to_id = note.replyId
        temp.in_reply_to_account_id = note.reply!.userId
    }

    for (let file of note.files) {
        let type = ""

        if (file.type.includes("image")) type = "image"
        else if (file.type.includes("video")) type = "video"

        let tempFile = {
            id: file.id,
            type: type,
            url: file.url,
            remote_url: file.url,
            preview_url: file.thumbnailUrl,
            text_url: file.url,
            meta: {},
            description: file.comment,
            blurhash: file.blurhash
        }

        temp.media_attachments.push(tempFile)
    }

    if ("tags" in note) {
        for (let tag of note.tags!) {
            temp.tags.push({
                name: tag,
                url: `https://${instance}/tags/${tag}`
            })
        }
    }

    // note.user

    return temp
}