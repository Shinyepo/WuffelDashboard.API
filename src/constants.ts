import { DiscordChannelSelectList, GetDiscordMembersResult } from "./types";

export const __prod__ = process.env.NODE_ENV === "production";

export const mockMembers: GetDiscordMembersResult[] = [
  {
    discriminator: "0",
    id: "1",
    username: "Member #1",
    nick: "cool guy",
    permissions: "0",
  },
  {
    discriminator: "0",
    id: "2",
    username: "Member #2",
    nick: "best guy",
    permissions: "0",
  },
];

export const mockChannels: DiscordChannelSelectList[] = [
  {
    id: "0",
    type: 4,
    name: "uncategorized",
    channels: [
      {
        id: "1",
        guild_id: "1",
        parent_id: undefined,
        position: 0,
        name: "Channel #1",
        type: 0,
      },
      {
        id: "2",
        guild_id: "1",
        parent_id: undefined,
        position: 1,
        name: "Channel #2",
        type: 0,
      },
      {
        id: "3",
        guild_id: "1",
        parent_id: undefined,
        position: 2,
        name: "Channel #3",
        type: 0,
      },
    ],
  },
  {
    id: "4",
    type: 4,
    name: "Category #1",
    channels: [
      {
        id: "5",
        guild_id: "1",
        parent_id: undefined,
        position: 3,
        name: "Channel #4",
        type: 0,
      },
      {
        id: "6",
        guild_id: "1",
        parent_id: undefined,
        position: 4,
        name: "Channel #5",
        type: 0,
      },
      {
        id: "7",
        guild_id: "1",
        parent_id: undefined,
        position: 5,
        name: "Channel #6",
        type: 0,
      },
    ],
  },

  {
    id: "8",
    type: 4,
    name: "Category #2",
    channels: [
      {
        id: "9",
        guild_id: "1",
        parent_id: undefined,
        position: 6,
        name: "Channel #7",
        type: 0,
      },
      {
        id: "10",
        guild_id: "1",
        parent_id: undefined,
        position: 7,
        name: "Channel #8",
        type: 0,
      },
      {
        id: "11",
        guild_id: "1",
        parent_id: undefined,
        position: 8,
        name: "Channel #9",
        type: 0,
      },
      {
        id: "12",
        guild_id: "1",
        parent_id: undefined,
        position: 9,
        name: "Channel #10",
        type: 0,
      },
      {
        id: "13",
        guild_id: "1",
        parent_id: undefined,
        position: 10,
        name: "Channel #11",
        type: 0,
      },
      {
        id: "14",
        guild_id: "1",
        parent_id: undefined,
        position: 11,
        name: "Channel #12",
        type: 0,
      },
    ],
  },
];
