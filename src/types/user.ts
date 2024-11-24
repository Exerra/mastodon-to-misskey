export interface MKUser {
    id:                              string;
    name:                            string;
    username:                        string;
    host:                            null;
    avatarUrl:                       string;
    avatarBlurhash:                  string;
    description:                     string;
    createdAt:                       Date;
    avatarDecorations:               any[];
    isBot:                           boolean;
    isCat:                           boolean;
    noindex:                         boolean;
    isSilenced:                      boolean;
    speakAsCat:                      boolean;
    approved:                        boolean;
    followersCount:                  number;
    followingCount:                  number;
    notesCount:                      number;
    emojis:                          Emojis;
    onlineStatus:                    string;
    badgeRoles:                      any[];
    url:                             null;
    uri:                             null;
    movedTo:                         null;
    alsoKnownAs:                     string[];
    updatedAt:                       Date;
    lastFetchedAt:                   null;
    bannerUrl:                       string;
    bannerBlurhash:                  string;
    backgroundUrl:                   string;
    backgroundBlurhash:              string;
    isLocked:                        boolean;
    isSuspended:                     boolean;
    location:                        string;
    birthday:                        null;
    listenbrainz:                    string;
    lang:                            string;
    fields:                          Field[];
    verifiedLinks:                   string[];
    pinnedNoteIds:                   string[];
    pinnedNotes:                     PinnedNote[];
    pinnedPageId:                    null;
    pinnedPage:                      null;
    publicReactions:                 boolean;
    followersVisibility:             string;
    followingVisibility:             string;
    twoFactorEnabled:                boolean;
    usePasswordLessLogin:            boolean;
    securityKeys:                    boolean;
    roles:                           Role[];
    memo:                            null;
    moderationNote:                  string;
    avatarId:                        string;
    bannerId:                        string;
    backgroundId:                    string;
    followedMessage:                 null;
    isModerator:                     boolean;
    isAdmin:                         boolean;
    isSystem:                        boolean;
    injectFeaturedNote:              boolean;
    receiveAnnouncementEmail:        boolean;
    alwaysMarkNsfw:                  boolean;
    defaultSensitive:                boolean;
    autoSensitive:                   boolean;
    carefulBot:                      boolean;
    autoAcceptFollowed:              boolean;
    noCrawle:                        boolean;
    preventAiLearning:               boolean;
    isExplorable:                    boolean;
    isDeleted:                       boolean;
    twoFactorBackupCodesStock:       string;
    hideOnlineStatus:                boolean;
    hasUnreadSpecifiedNotes:         boolean;
    hasUnreadMentions:               boolean;
    hasUnreadAnnouncement:           boolean;
    unreadAnnouncements:             any[];
    hasUnreadAntenna:                boolean;
    hasUnreadChannel:                boolean;
    hasUnreadNotification:           boolean;
    hasPendingReceivedFollowRequest: boolean;
    hasPendingSentFollowRequest:     boolean;
    unreadNotificationsCount:        number;
    mutedWords:                      any[];
    hardMutedWords:                  Array<string[]>;
    mutedInstances:                  any[];
    mutingNotificationTypes:         any[];
    notificationRecieveConfig:       NotificationRecieveConfig;
    emailNotificationTypes:          string[];
    achievements:                    Achievement[];
    loggedInDays:                    number;
    policies:                        Policies;
    email:                           string;
    emailVerified:                   boolean;
    signupReason:                    null;
    securityKeysList:                SecurityKeysList[];
}

export interface Achievement {
    name:       string;
    unlockedAt: number;
}

export interface Emojis {
    wee: string;
}

export interface Field {
    name:  string;
    value: string;
}

export interface NotificationRecieveConfig {
}

export interface PinnedNote {
    id:                 string;
    createdAt:          Date;
    userId:             string;
    user:               User;
    text:               string;
    cw:                 null;
    visibility:         string;
    localOnly:          boolean;
    reactionAcceptance: string;
    renoteCount:        number;
    repliesCount:       number;
    reactionCount:      number;
    reactions:          NotificationRecieveConfig;
    reactionEmojis:     NotificationRecieveConfig;
    tags:               string[];
    fileIds:            any[];
    files:              any[];
    replyId:            null;
    renoteId:           null;
    clippedCount:       number;
}

export interface User {
    id:                string;
    name:              string;
    username:          string;
    host:              null;
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
    followersCount:    number;
    followingCount:    number;
    notesCount:        number;
    emojis:            Emojis;
    onlineStatus:      string;
    badgeRoles:        any[];
}

export interface Policies {
    gtlAvailable:               boolean;
    btlAvailable:               boolean;
    ltlAvailable:               boolean;
    canPublicNote:              boolean;
    mentionLimit:               number;
    canInvite:                  boolean;
    inviteLimit:                number;
    inviteLimitCycle:           number;
    inviteExpirationTime:       number;
    canManageCustomEmojis:      boolean;
    canManageAvatarDecorations: boolean;
    canSearchNotes:             boolean;
    canUseTranslator:           boolean;
    canHideAds:                 boolean;
    driveCapacityMb:            number;
    alwaysMarkNsfw:             boolean;
    canUpdateBioMedia:          boolean;
    pinLimit:                   number;
    antennaLimit:               number;
    wordMuteLimit:              number;
    webhookLimit:               number;
    clipLimit:                  number;
    noteEachClipsLimit:         number;
    userListLimit:              number;
    userEachUserListsLimit:     number;
    rateLimitFactor:            number;
    canImportNotes:             boolean;
    avatarDecorationLimit:      number;
    canImportAntennas:          boolean;
    canImportBlocking:          boolean;
    canImportFollowing:         boolean;
    canImportMuting:            boolean;
    canImportUserLists:         boolean;
}

export interface Role {
    id:              string;
    name:            string;
    color:           null;
    iconUrl:         string;
    description:     string;
    isModerator:     boolean;
    isAdministrator: boolean;
    displayOrder:    number;
}

export interface SecurityKeysList {
    id:       string;
    name:     string;
    lastUsed: Date;
}
