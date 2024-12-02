import { MKTimelineUser } from "../types/timeline";
import { MKUserI } from "../types/useri";
import { isURL } from "../util/isURL";
import { MastoEmoji, MKEmojisToMasto } from "./emoji";
import { parseMD } from "./markdown";

export const MKUserToMasto = (user: MKUserI | MKTimelineUser, instance: string) => {
	let emojis: MastoEmoji[] = []
    try {
		if ("emojis" in user && Array.isArray(user.emojis)) emojis = MKEmojisToMasto(user.emojis)
	} catch (e) {
		// nothing
	}

	// let emojis = MKEmojisToMasto(user.emojis)
	let fields = []

	if ("fields" in user) {
        for (let field of user.fields) {
            let { name, value } = field
    
            let temp = {
                name: name,
                value: "",
                verified_At: null // TODO: verify links
            }
    
            if (isURL(value)) temp.value = `<a rel="nofollow noopener noreferrer" target="_blank" href="${value.replace("http://", "").replace("https://", "")}"></a>` // TODO: use URL() to trim protocol and add query trimming
            else temp.value = `<span>${value}</span>`
    
            fields.push(temp)
        }
    }

	return {
		id: user.id,
		username: user.username,
		acct: user.username,
		fqn: `${user.username}@${user.host || instance}`,
		display_name: user.name || user.username,
		displayName: user.name || user.username,
		locked: 'isLocked' in user ? user.isLocked : false,
		created_at: user.createdAt,
		followers_count: user.followersCount,
		following_count: user.followingCount,
		statuses_count: user.notesCount,
		note: parseMD(user.description || "", instance),
		url: `https://${instance}/@${user.username}`,
		uri: `https://${instance}/users/${user.id}`,
		avatar: user.avatarUrl,
		avatar_static: user.avatarUrl,
		header: 'bannerUrl' in user ? user.bannerUrl : '',
		header_static: 'bannerUrl' in user ? user.bannerUrl : '',
		emojis: emojis,
		moved: 'movedTo' in user ? user.movedTo : null,
		fields: fields,
		bot: user.isBot,
		discoverable: 'isExplorable' in user ? user.isExplorable : true,
		source: {
			note: user.description,
			fields: fields,
			privacy: "",
			sensitive: 'autoSensitive' in user ? user.autoSensitive : false,
			langauge: "english"
		}
	}
}