import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseconfig";

export const signInWithGoogle = createAsyncThunk(
  "auth/googleSignIn",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const googleLogout = createAsyncThunk("auth/googleLogout", async () => {
  await signOut(auth);
});

const initialState = {
  user: null,
  isGuest: false,
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setGuestMode: (state) => {
      state.isGuest = true;
      state.user = {
        uid: "local/guestUser",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithGoogle.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(googleLogout.fulfilled, (state) => {
        state.user = null;
      });
  },
});
export default authSlice.reducer;
export const { setGuestMode } = authSlice.actions;
