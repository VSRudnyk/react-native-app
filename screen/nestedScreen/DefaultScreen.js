import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { EvilIcons } from '@expo/vector-icons';
import { db } from '../../firebase/config';

export const DefaultScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  const getAllPosts = async () => {
    const colRef = collection(db, 'posts');

    await onSnapshot(colRef, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.photo }} style={styles.image} />
            <View>
              <Text style={styles.commentsText}>{item.comment}</Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.commentsBtn}
                onPress={() =>
                  navigation.navigate('Comments', { postId: item.id })
                }
              >
                <EvilIcons name="comment" size={24} color="#BDBDBD" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.mapBtn}
                onPress={() =>
                  navigation.navigate('Map', { location: item.location })
                }
              >
                <EvilIcons name="location" size={24} color="#BDBDBD" />
                <Text></Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: 'white',
  },
  imageWrapper: {
    marginTop: 32,
    marginBottom: 10,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  image: {
    minWidth: 100,
    height: 240,
    borderRadius: 8,
  },
  commentsText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#212121',
    marginTop: 8,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
