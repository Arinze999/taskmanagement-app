import { AuthUser, initialState } from '@/schemas/auth/signin.schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (s: RootState) => s.auth as AuthUser;
