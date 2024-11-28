import { MKTimelineUser } from "../types/timeline";
import { MKUserI } from "../types/useri";
import { isURL } from "../util/isURL";
import { MKEmojisToMasto } from "./emoji";

export const MKUserToMasto = (user: MKUserI | MKTimelineUser, instance: string) => {
    let emojis = MKEmojisToMasto(user.emojis)
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
		fqn: `${user.username}@${instance}`,
		display_name: user.name || user.username,
		displayName: user.name || user.username,
		locked: 'isLocked' in user ? user.isLocked : false,
		created_at: user.createdAt,
		followers_count: user.followersCount,
		following_count: user.followingCount,
		statuses_count: user.notesCount,
		note: user.description || "",
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