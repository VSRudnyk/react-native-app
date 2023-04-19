import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCgxziha5Ntdx9ETY0jFOZKbglLEHYP_Cs',
  authDomain: 'r-n-social-4d515.firebaseapp.com',
  projectId: 'r-n-social-4d515',
  storageBucket: 'r-n-social-4d515.appspot.com',
  messagingSenderId: '433700296904',
  appId: '1:433700296904:web:6560dd1801a0ac2ad62dfd',
  measurementId: 'G-QD19RKQQK1',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
