import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { app } from '../../firebase/config';
import { authSlice } from './authReducer';
import { notification } from '../../components/Notification';

const auth = getAuth(app);
const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

export const authSignUpUser =
  ({ email, password, login, userImage }) =>
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
      notification(`Пользователь ${login} успешно зарегистрирован`, 'success');
    } catch (error) {
      notification(`Пользователь с почтой ${email} уже существует`, 'danger');
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
      };
      dispatch(authStateChange({ stateChange: true }));
      dispatch(updateUserProfile(userUpdateProfile));
    }
  });
};
