import { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { authSignOutUser } from '../../redux/auth/authOperations';
import { db } from '../../firebase/config';

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    getUserPost();
  }, []);

  const getUserPost = async () => {
    const postsRef = await collection(db, 'posts');
    const queryPosts = await query(postsRef, where('userId', '==', userId));

    await onSnapshot(queryPosts, (snapshot) => {
      setUserPosts(snapshot.docs.map((doc) => doc.data()));
    });
  };

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.signOutBtn}
        activeOpacity={0.8}
        onPress={signOut}
      >
        <Text>Sign Out</Text>
      </TouchableOpacity>
      <FlatList
        data={userPosts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.photo }} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  signOutBtn: {
    borderRadius: 10,
    backgroundColor: '#FF6C00',
    height: 20,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  imageWrapper: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 200,
    borderRadius: 10,
  },
});
