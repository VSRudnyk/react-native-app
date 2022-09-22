import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBqLN8HReXKY6Xx2Qqdkqe-15C3NM5G3DI',
  authDomain: 'r-n-social.firebaseapp.com',
  projectId: 'r-n-social',
  storageBucket: 'r-n-social.appspot.com',
  messagingSenderId: '212818060657',
  appId: '1:212818060657:web:698855c3c75417ccef42d0',
  measurementId: 'G-5M9KHR5YKG',
};

const app = initializeApp(firebaseConfig);
export default auth = getAuth(app);
