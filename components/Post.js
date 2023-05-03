import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getDocs, collectionGroup, query } from 'firebase/firestore';
import { EvilIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import ImageModal from 'react-native-image-modal';
import { db } from '../firebase/config';

const { height, width } = Dimensions.get('window');

export const Post = ({ navigation, posts }) => {
  const isFocused = useIsFocused();
  const [allComments, setAllComments] = useState([]);
  useEffect(() => {
    fetchAllComments();
  }, [isFocused]);

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
    <>
      {isFocused && (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <ImageModal
                resizeMode="center"
                imageBackgroundColor="#fff"
                style={styles.image}
                source={{
                  uri: item.photoURL,
                }}
              />

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
                      photo: item.photoURL,
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
    </>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    marginTop: 32,
    marginBottom: 10,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  image: {
    height: 240,
    width: width - 32,
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
    fontFamily: 'Roboto-Regular',
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
