import { createSlice } from '@reduxjs/toolkit';

const state = {
  userId: null,
  login: null,
  stateChange: false,
  userImage: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload }) => {
      return {
        ...state,
        userId: payload.userId,
        login: payload.login,
        userImage: payload.userImage,
      };
    },
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: () => state,
  },
});
