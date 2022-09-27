import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRoute } from '../router';

const auth = getAuth();

export const Main = () => {
  const [user, setUser] = useState(null);
  const state = useSelector((state) => state);
  console.log(state);
  const routing = useRoute(user);
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
  return <NavigationContainer>{routing}</NavigationContainer>;
};
