import Moment from "@/components/shared/Moment";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface User {
  friendRequests?: string[];
  friends?: string[];
  pendingFriends?: string[];
}

interface Conversation {
  lastMessage?: any;
  _id: string;
  participants: [];
  createdAt: Date;
  updatedAt: Date;
}

interface Message {}

interface Notification {}
interface NewNotification {}

interface Moment {
  userId: string;
  description?: string;
  momentPath?: string[];
  emojis: Map<string, string>;
  visibility: "public" | "private" | "friends";
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  isArchive: Boolean;
  _id: string;
}
interface Memory {
  userId: string;
  momentPath?: string;
  likes: Map<string, boolean>;
  visibility: "public" | "private" | "friends";
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

interface Comment {
  avatarPath: string;
  createdAt: Date;
  description: string;
  likes: Map<string, boolean>;
  replies: [];
  updatedAt: Date;
  userId: string;
  userName: string;
  __v: 0;
  _id: string;
}

interface AuthState {
  user: User | null;
  conversation: Conversation | null;
  token: string | null;
  moment: Moment | null;
  conversations: Conversation[];
  moments: Moment[];
  comments: Comment[];
  messages: Message[];
  memories: Memory[];
  notifications: Notification[];
  newNotifications: Notification[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  moment: null,
  conversation: null,
  conversations: [],
  moments: [],
  comments: [],
  memories: [],
  messages: [],
  notifications: [],
  newNotifications: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.conversation = null;
      state.moment = null;
      state.moments = [];
      state.memories = [];
      state.conversations = [];
      state.comments = [];
      state.messages = [];
      state.notifications = [];
    },
    addFriendRequest: (
      state,
      action: PayloadAction<{ friendrequest: string }>
    ) => {
      state.user?.friendRequests?.push(action.payload.friendrequest);
    },
    addPendingRequest: (
      state,
      action: PayloadAction<{ pendingFriends: string }>
    ) => {
      state.user?.pendingFriends?.push(action.payload.pendingFriends);
    },
    addFriend: (state, action: PayloadAction<{ friend: string }>) => {
      state.user?.friends?.push(action.payload.friend);
    },
    changeUserDetails: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
    },
    setMoments: (state, action: PayloadAction<{ moments: Moment[] }>) => {
      state.moments = action.payload.moments;
    },
    setNotifications: (
      state,
      action: PayloadAction<{ notifications: Notification[] }>
    ) => {
      state.notifications = action.payload.notifications;
    },
    setNewNotifications: (
      state,
      action: PayloadAction<{ notifications: Notification[] }>
    ) => {
      state.newNotifications = action.payload.notifications;
    },
    addMomment: (state, action: PayloadAction<{ moment: Moment }>) => {
      state.moments.unshift(action.payload.moment);
    },
    setComments: (state, action: PayloadAction<{ comments: Comment[] }>) => {
      state.comments = action.payload.comments;
    },
    setComment: (state, action: PayloadAction<{ comment: Comment }>) => {
      const updatedComments = state.comments.map((comment) => {
        if (comment._id === action.payload.comment._id)
          return action.payload.comment;
        return comment;
      });
      state.comments = updatedComments;
    },
    addComment: (state, action: PayloadAction<{ comment: Comment }>) => {
      state.comments.unshift(action.payload.comment);
    },
    deleteCommentById: (state, action: PayloadAction<{ id: any }>) => {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload.id
      );
    },
    setMoment: (state, action: PayloadAction<{ moment: Moment }>) => {
      const updatedMoments = state.moments.map((moment) => {
        if (moment._id === action.payload.moment._id)
          return action.payload.moment;
        return moment;
      });
      state.moments = updatedMoments;
    },
    setMomentEmoji: (
      state,
      action: PayloadAction<{ momentid: string; moment: Moment }>
    ) => {
      if (
        state.moment !== null &&
        state.moment._id == action.payload.momentid
      ) {
        state.moment == action.payload.moment;
      }
    },
    setSingleMoment: (state, action: PayloadAction<{ moment: Moment }>) => {
      state.moment = action.payload.moment;
      console.log("done redux");
    },
    setMemories: (state, action: PayloadAction<{ memories: Memory[] }>) => {
      state.memories = action.payload.memories;
    },
    setMessages: (state, action: PayloadAction<{ messages: Message[] }>) => {
      state.messages = action.payload.messages;
    },
    setMemory: (state, action: PayloadAction<{ memory: Memory }>) => {
      const updatedMoments = state.memories.map((memory) => {
        if (memory._id === action.payload.memory._id)
          return action.payload.memory;
        return memory;
      });
      state.memories = updatedMoments;
    },
    setConversation: (
      state,
      action: PayloadAction<{ conversation: Conversation | null }>
    ) => {
      state.conversation = action.payload.conversation;
    },
    setConversations: (
      state,
      action: PayloadAction<{ conversations: Conversation[] }>
    ) => {
      state.conversations = action.payload.conversations;
    },
    setLastSeen: (
      state,
      action: PayloadAction<{ conversationId: string; lastMessage: any }>
    ) => {
      const { conversationId, lastMessage } = action.payload;
      if (state.conversation?._id == conversationId) {
        state.conversation.lastMessage = lastMessage;
      }

      const conversationToUpdate = state.conversations.find(
        (conversation) => conversation._id === conversationId
      );

      if (conversationToUpdate) {
        conversationToUpdate.lastMessage = lastMessage;
      }
    },
  },
});

export const {
  addPendingRequest,
  setNewNotifications,
  setLogin,
  setLogout,
  addFriendRequest,
  addFriend,
  changeUserDetails,
  setMoments,
  setNotifications,
  setComments,
  deleteCommentById,
  addComment,
  addMomment,
  setComment,
  setMoment,
  setMomentEmoji,
  setSingleMoment,
  setMemories,
  setMemory,
  setConversation,
  setConversations,
  setMessages,
  setLastSeen,
} = authSlice.actions;
export default authSlice.reducer;
