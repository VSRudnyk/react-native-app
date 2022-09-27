import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { app } from '../../firebase/config';
import { authSlice } from './authReducer';

const auth = getAuth(app);

export const authSignUpUser =
  ({ email, password, login }) =>
  async (dispatch, getSatte) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      const user = await auth.currentUser;

      await updateProfile(auth.currentUser, { displayName: login });

      const userUpdateProfile = {
        userId: user.uid,
        login: user.displayName,
      };
      dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getSatte) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = await auth.currentUser;
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getSatte) => {};

export const authStateChangeUser = () => async (dispatch, getSatte) => {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        userId: user.uid,
        login: user.displayName,
      };
      dispatch(authSlice.actions.authStateChange({ stateChange: true }));
      dispatch(authSlice.actions.updateUserProfile(userUpdateProfile));
    }
  });
};
