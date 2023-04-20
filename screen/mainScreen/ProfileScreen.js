import { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { authSignOutUser } from '../../redux/auth/authOperations';
import { db } from '../../firebase/config';

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const { userId, userImage, login } = useSelector((state) => state.auth);
  const isFocused = useIsFocused();

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
    <ImageBackground
      style={styles.imageBackground}
      source={require('../../assets/image/bg-image.png')}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.signOutBtn}
          activeOpacity={0.8}
          onPress={signOut}
        >
          <MaterialIcons name="logout" size={24} color="#BDBDBD" />
        </TouchableOpacity>
        <View style={styles.userImageContainer}>
          <Image source={{ uri: userImage }} style={styles.userImage} />
        </View>
        <Text style={styles.userName}>{login}</Text>
        {isFocused && (
          <FlatList
            data={userPosts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.photo }} style={styles.image} />
              </View>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    marginTop: 147,
    backgroundColor: '#fff',
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
  },
  userImageContainer: {
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: [{ translateX: -60 }],
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  signOutBtn: {
    position: 'absolute',
    top: 22,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  image: {
    borderWidth: 1,
    height: 240,
    width: '100%',
    borderRadius: 10,
  },
  userName: {
    marginTop: 92,
    marginBottom: 32,
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    color: '#212121',
    textAlign: 'center',
  },
});
