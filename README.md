# Mastodon to Misskey bridge

⚠️ Currently only supports Sharkey servers due to the OAuth API not being implemented ⚠️

The fediverse is made up of many interconnected instances built on top of many different softwares. They all communicate with eachother, but a clear dominant player has emerged - Mastodon. Many apps and tools have been made with only Mastodon in mind, and Misskey lacks those tools. It lacks good apps.

This project aims to bridge the gap by translating Mastodon API calls to Misskey API calls.

## Usage

1. To use this project you will need Bun installed. [Install steps](https://bun.sh/)
2. Clone the project (`git clone https://github.com/Exerra/mastodon-to-misskey.git`)
3. Install deps (`bun i`)
4. Duplicate `.env.example`, rename it to `.env` and fill it in.
4. Run `bun start`

## Tested apps
- [Phanpy](https://phanpy.social)
- Mastodon for iOS

## Known missing features

- OAuth API (so only Sharkey servers can use it for now)
- Search
