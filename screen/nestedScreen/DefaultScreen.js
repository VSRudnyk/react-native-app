import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  collection,
  onSnapshot,
  getDocs,
  collectionGroup,
  query,
} from 'firebase/firestore';
import { EvilIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { db } from '../../firebase/config';

export const DefaultScreenPosts = ({ navigation }) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    getAllPosts();
    fetchAllComments();
  }, []);

  const [posts, setPosts] = useState([]);
  const [allComments, setAllComments] = useState([]);

  const getAllPosts = async () => {
    const colRef = collection(db, 'posts');

    await onSnapshot(colRef, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  const fetchAllComments = async () => {
    const comments = query(collectionGroup(db, 'comment'));
    const querySnapshot = await getDocs(comments);
    setAllComments(querySnapshot.docs.map((doc) => ({ ...doc.data() })));
  };

  const countComments = (postId) => {
    const number = allComments.filter((comment) => comment.postId === postId);

    return number.length;
  };

  return (
    <View style={styles.container}>
      {isFocused && (
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
                    navigation.navigate('Коментарі', {
                      postId: item.id,
                      photo: item.photo,
                    })
                  }
                >
                  <View style={styles.commentContainer}>
                    <EvilIcons
                      name="comment"
                      size={24}
                      color={countComments(item.id) > 0 ? '#FF6C00' : '#BDBDBD'}
                    />
                    <Text
                      style={{
                        ...styles.commentText,
                        color:
                          countComments(item.id) > 0 ? '#212121' : '#BDBDBD',
                      }}
                    >
                      {countComments(item.id)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.mapBtn}
                  onPress={() =>
                    navigation.navigate('Мапа', { location: item.location })
                  }
                >
                  <View style={styles.locationContainer}>
                    <EvilIcons name="location" size={24} color="#BDBDBD" />
                    <Text
                      style={styles.locationText}
                    >{`${item.location.city}, ${item.location.country}`}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },
  locationText: {
    color: '#212121',
    fontFamily: 'Roboto-Medium',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },
  commentText: {
    color: '#BDBDBD',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    marginLeft: 6,
  },
});
