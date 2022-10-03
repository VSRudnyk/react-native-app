import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { useRoute } from '../router';
import { authStateChangeUser } from '../redux/auth/authOperations';

const auth = getAuth();

export const Main = () => {
  const { stateChange } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const routing = useRoute(stateChange);

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  return <NavigationContainer>{routing}</NavigationContainer>;
};
