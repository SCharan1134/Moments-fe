import Moment from "@/components/shared/Moment";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface User {
  // Define your user object structure here
}

interface Moment {
  userId: string;
  description?: string;
  momentPath?: string;
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
  token: string | null;
  moment: Moment | null;
  moments: Moment[];
  comments: Comment[];
  memories: Memory[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  moment: null,
  moments: [],
  comments: [],
  memories: [],
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
      state.moments = [];
      state.memories = [];
    },
    changeUserDetails: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
    },
    setMoments: (state, action: PayloadAction<{ moments: Moment[] }>) => {
      state.moments = action.payload.moments;
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
    setSingleMoment: (state, action: PayloadAction<{ moment: Moment }>) => {
      state.moment = action.payload.moment;
    },
    setMemories: (state, action: PayloadAction<{ memories: Memory[] }>) => {
      state.memories = action.payload.memories;
    },
    setMemory: (state, action: PayloadAction<{ memory: Memory }>) => {
      const updatedMoments = state.memories.map((memory) => {
        if (memory._id === action.payload.memory._id)
          return action.payload.memory;
        return memory;
      });
      state.memories = updatedMoments;
    },
  },
});

export const {
  setLogin,
  setLogout,
  changeUserDetails,
  setMoments,
  setComments,
  deleteCommentById,
  addComment,
  addMomment,
  setComment,
  setMoment,
  setSingleMoment,
  setMemories,
  setMemory,
} = authSlice.actions;
export default authSlice.reducer;
