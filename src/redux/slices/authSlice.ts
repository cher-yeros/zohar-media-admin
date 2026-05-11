import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/types/api";

interface AuthState {
  currentUser: User | null;
  credential: Record<string, unknown>;
  token: string | null;
  avatar: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  credential: {},
  token: null,
  avatar: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStarted() {
      // No state changes needed for login started
    },
    loginFinished(state, action) {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
    },
    loginError() {
      // No state changes needed for login error
    },
    setRefreshedToken() {
      // No state changes needed for refreshed token
    },
    logoutFinished(state) {
      state.currentUser = null;
      state.credential = {};
      state.avatar = null;
      state.token = null;
    },
    logoutError() {
      // No state changes needed for logout error
    },
    addAvatar(state, action) {
      state.avatar = action.payload;
    },
    setFirstTime(state) {
      if (state.currentUser) {
        // @ts-expect-error - assuming user has firstTime property
        state.currentUser.firstTime = false;
      }
    },
    clearError() {
      // No state changes needed for clear error
    },
    logoutUser(state) {
      state.currentUser = null;
      state.credential = {};
      state.avatar = null;
      state.token = null;
    },
    patchCurrentUser(state, action: PayloadAction<Partial<User>>) {
      if (!state.currentUser) return;
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
  },
});

export const {
  loginStarted,
  loginFinished,
  loginError,
  setRefreshedToken,
  logoutFinished,
  logoutError,
  addAvatar,
  setFirstTime,
  clearError,
  logoutUser,
  patchCurrentUser,
} = authSlice.actions;

export default authSlice.reducer;
