import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { authSlice } from './authReducer';
import { notification } from '../../function/appNotification';

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

export const authSignUpUser =
  ({ email, password, login, userImage }, setLoading) =>
  async (dispatch, getSatte) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = await auth.currentUser;
      await updateProfile(auth.currentUser, {
        displayName: login,
        photoURL: userImage,
      });
      const userUpdateProfile = await {
        userId: user.uid,
        login: user.displayName,
        userImage: user.photoURL,
      };
      dispatch(updateUserProfile(userUpdateProfile));
      notification(`User ${login} registered successfully`, 'success');
    } catch (error) {
      setLoading(false);
      notification(error.message.toString(), 'warning');
    }
  };

export const authSignInUser =
  ({ email, password }, setLoading) =>
  async (dispatch, getSatte) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = await auth.currentUser;
    } catch (error) {
      setLoading(false);
      notification(error.message.toString(), 'warning');
    }
  };

export const authSignOutUser = () => async (dispatch, getSatte) => {
  await signOut(auth);
  dispatch(authSignOut());
};

export const authStateChangeUser = () => async (dispatch, getSatte) => {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUpdateProfile = {
        userId: user.uid,
        login: user.displayName,
        userImage: user.photoURL,
      };
      dispatch(authStateChange({ stateChange: true }));
      dispatch(updateUserProfile(userUpdateProfile));
    }
  });
};
