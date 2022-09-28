import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBqLN8HReXKY6Xx2Qqdkqe-15C3NM5G3DI',
  authDomain: 'r-n-social.firebaseapp.com',
  projectId: 'r-n-social',
  storageBucket: 'r-n-social.appspot.com',
  messagingSenderId: '212818060657',
  appId: '1:212818060657:web:698855c3c75417ccef42d0',
  measurementId: 'G-5M9KHR5YKG',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
