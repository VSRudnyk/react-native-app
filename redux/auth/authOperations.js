import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { app } from '../../firebase/config';
import { authSlice } from './authReducer';

export const authSignUpUser =
  ({ email, password, login }) =>
  async (dispatch, getSatte) => {
    const auth = getAuth(app);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch(authSlice.actions.updateUserProfile({ userId: user.uid }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getSatte) => {
    const auth = getAuth(app);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

export const authSignOutUser = () => async (dispatch, getSatte) => {};

export const authStateChangeUser = () => async (dispatch, getSatte) => {};
