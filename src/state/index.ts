import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface User {
  // Define your user object structure here
}

interface Moment {
  userId: string;
  description?: string;
  momentPath?: string;
  likes: Map<string, boolean>;
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

interface AuthState {
  user: User | null;
  token: string | null;
  moments: Moment[];
  memories: Memory[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  moments: [],
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
    setMoment: (state, action: PayloadAction<{ moment: Moment }>) => {
      const updatedMoments = state.moments.map((moment) => {
        if (moment._id === action.payload.moment._id)
          return action.payload.moment;
        return moment;
      });
      state.moments = updatedMoments;
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
  setMoment,
  setMemories,
  setMemory,
} = authSlice.actions;
export default authSlice.reducer;
