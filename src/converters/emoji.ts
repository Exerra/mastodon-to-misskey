import { TentacledEmojis } from "../types/timeline"
import { Emojis } from "../types/useri"

export const MKEmojisToMasto = (emojis: Emojis | TentacledEmojis) => {
    let temp = []

    for (let emoji of Object.keys(emojis)) {
		// TODO: fix types
		// @ts-ignore
		let url = emojis[emoji]
		temp.push({
			shortcode: emoji,
			static_url: url,
			url: url,
			visible_in_picker: true
		})
	}

    return temp
}