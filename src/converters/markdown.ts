import { marked } from "marked";

export const parseMD = (md: string, instance: string) => {
    const renderer = new marked.Renderer()

    renderer.text = ({ text }) => {
        const tagRegex = /#(\w+)/g;


        let temp = text

        temp = temp.replace(tagRegex, (match, tag) => {
            const url = `https://${instance}/tags/${tag}`;
            return `<a href="${url}" class="mention hashtag" target="_blank" rel="tag">#<span>${tag}</span></a>`;
        });
        return temp
    }

    marked.setOptions({ renderer })

    let text = md
        ?.replaceAll(/@([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]+)/g, (match, username, domain) => {
            return `<span class="h-card" translate="no"><a href="https://${domain}/@${username}" class="u-url mention">@<span>${username}</span></a></span>`
        })

    return marked.parse(text || "")
}