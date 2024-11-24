export type MKTimeline = Array<MKTimelineItem>

export interface MKTimelineItem {
    id:                 string;
    createdAt:          Date;
    userId:             string;
    user:               MKTimelineUser;
    text:               null | string;
    cw:                 null | string;
    visibility:         Visibility;
    localOnly:          boolean;
    reactionAcceptance: null;
    renoteCount:        number;
    repliesCount:       number;
    reactionCount:      number;
    reactions:          ReactionEmojis;
    reactionEmojis:     ReactionEmojis;
    emojis:             MKTimelineEmojis;
    fileIds:            string[];
    files:              File[];
    replyId:            null | string;
    renoteId:           null | string;
    uri:                string;
    url?:               string;
    clippedCount:       number;
    renote?:            MKTimelineRenote;
    tags?:              string[];
    reply?:             MKTimelineReply;
    mentions?:          string[];
    updatedAt?:         Date;
}

export interface MKTimelineEmojis {
    nullcatchan_goodnight?: string;
}

export interface File {
    id:           string;
    createdAt:    Date;
    name:         string;
    type:         Type;
    md5:          string;
    size:         number;
    isSensitive:  boolean;
    blurhash:     null | string;
    properties:   Properties;
    url:          string;
    thumbnailUrl: null | string;
    comment:      null | string;
    folderId:     null;
    folder:       null;
    userId:       string;
    user:         null;
}

export interface Properties {
    width?:  number;
    height?: number;
}

export enum Type {
    ImageJPEG = "image/jpeg",
    ImagePNG = "image/png",
    ImageWebp = "image/webp",
    VideoMp4 = "video/mp4",
}

export interface ReactionEmojis {
}

export interface MKTimelineRenote {
    id:                 string;
    createdAt:          Date;
    userId:             string;
    user:               FluffyUser;
    text:               null | string;
    cw:                 null;
    visibility:         Visibility;
    localOnly:          boolean;
    reactionAcceptance: null;
    renoteCount:        number;
    repliesCount:       number;
    reactionCount:      number;
    reactions:          Reactions;
    reactionEmojis:     ReactionEmojis;
    emojis:             ReactionEmojis;
    tags?:              string[];
    fileIds:            string[];
    files:              File[];
    replyId:            null | string;
    renoteId:           null | string;
    mentions?:          string[];
    uri:                string;
    url?:               string;
    clippedCount:       number;
    renote?:            RenoteRenote;
    reply?:             RenoteReply;
}

export interface Reactions {
    "❤"?: number;
}

export interface RenoteRenote {
    id:                 string;
    createdAt:          Date;
    userId:             string;
    user:               PurpleUser;
    text:               string;
    cw:                 null;
    visibility:         Visibility;
    localOnly:          boolean;
    reactionAcceptance: null;
    renoteCount:        number;
    repliesCount:       number;
    reactionCount:      number;
    reactions:          ReactionEmojis;
    reactionEmojis:     ReactionEmojis;
    emojis:             MKTimelineEmojis;
    fileIds:            any[];
    files:              any[];
    replyId:            null;
    renoteId:           null;
    uri:                string;
    clippedCount:       number;
}

export interface PurpleUser {
    id:                string;
    name:              string;
    username:          string;
    host:              string;
    avatarUrl:         string;
    avatarBlurhash:    string;
    description:       string;
    createdAt:         Date;
    avatarDecorations: any[];
    isBot:             boolean;
    isCat:             boolean;
    noindex:           boolean;
    isSilenced:        boolean;
    speakAsCat:        boolean;
    approved:          boolean;
    instance:          Instance;
    followersCount:    number;
    followingCount:    number;
    notesCount:        number;
    emojis:            PurpleEmojis;
    onlineStatus:      OnlineStatus;
}

export interface PurpleEmojis {
    angry_ai: string;
    syuilo:   string;
}

export interface Instance {
    name:            null | string;
    softwareName:    SoftwareName | null;
    softwareVersion: null | string;
    iconUrl:         null | string;
    faviconUrl:      null | string;
    themeColor:      null | string;
}

export enum SoftwareName {
    Akkoma = "akkoma",
    Mastodon = "mastodon",
    Misskey = "misskey",
    Sharkey = "sharkey",
    Wafrn = "wafrn",
}

export enum OnlineStatus {
    Unknown = "unknown",
}

export enum Visibility {
    Followers = "followers",
    Home = "home",
    Public = "public",
}

export interface RenoteReply {
    id:                 string;
    createdAt:          Date;
    userId:             string;
    user:               ReplyUser;
    text:               string;
    cw:                 null;
    visibility:         Visibility;
    localOnly:          boolean;
    reactionAcceptance: null;
    renoteCount:        number;
    repliesCount:       number;
    reactionCount:      number;
    reactions:          ReactionEmojis;
    reactionEmojis:     ReactionEmojis;
    emojis:             ReactionEmojis;
    fileIds:            any[];
    files:              any[];
    replyId:            null;
    renoteId:           null;
    uri:                string;
}

export interface ReplyUser {
    id:                string;
    name:              null | string;
    username:          string;
    host:              string;
    avatarUrl:         string;
    avatarBlurhash:    null | string;
    description:       null | string;
    createdAt:         Date;
    avatarDecorations: any[];
    isBot:             boolean;
    isCat:             boolean;
    noindex:           boolean;
    isSilenced:        boolean;
    speakAsCat:        boolean;
    approved:          boolean;
    instance:          Instance;
    followersCount:    number;
    followingCount:    number;
    notesCount:        number;
    emojis:            ReactionEmojis;
    onlineStatus:      OnlineStatus;
}

export interface FluffyUser {
    id:                string;
    name:              null | string;
    username:          string;
    host:              string;
    avatarUrl:         string;
    avatarBlurhash:    null | string;
    description:       null | string;
    createdAt:         Date;
    avatarDecorations: any[];
    isBot:             boolean;
    isCat:             boolean;
    noindex:           boolean;
    isSilenced:        boolean;
    speakAsCat:        boolean;
    approved:          boolean;
    instance:          Instance;
    followersCount:    number;
    followingCount:    number;
    notesCount:        number;
    emojis:            FluffyEmojis;
    onlineStatus:      OnlineStatus;
}

export interface FluffyEmojis {
    neocat_floof_devil_256?: string;
    vrc?:                    string;
    rust_lang?:              string;
    booth?:                  string;
    github?:                 string;
}

export interface MKTimelineReply {
    id:                 string;
    createdAt:          Date;
    userId:             string;
    user:               ReplyUser;
    text:               string;
    cw:                 null | string;
    visibility:         Visibility;
    localOnly:          boolean;
    reactionAcceptance: null;
    renoteCount:        number;
    repliesCount:       number;
    reactionCount:      number;
    reactions:          ReactionEmojis;
    reactionEmojis:     ReactionEmojis;
    emojis:             ReactionEmojis;
    fileIds:            string[];
    files:              File[];
    replyId:            null;
    renoteId:           null;
    uri:                string;
    url:                string;
    updatedAt?:         Date;
    tags?:              string[];
}

export interface MKTimelineUser {
    id:                string;
    name:              string;
    username:          string;
    host:              string;
    avatarUrl:         string;
    avatarBlurhash:    string;
    description:       string;
    createdAt:         Date;
    avatarDecorations: any[];
    isBot:             boolean;
    isCat:             boolean;
    noindex:           boolean;
    isSilenced:        boolean;
    speakAsCat:        boolean;
    approved:          boolean;
    instance:          Instance;
    followersCount:    number;
    followingCount:    number;
    notesCount:        number;
    emojis:            TentacledEmojis;
    onlineStatus:      OnlineStatus;
}

export interface TentacledEmojis {
    maia?:      string;
    fediverse?: string;
    weed?:      string;
    angry_ai?:  string;
    syuilo?:    string;
    verified?:  string;
}
