import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {
  collectionGroup,
  query,
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { EvilIcons } from '@expo/vector-icons';
import ImageModal from 'react-native-image-modal';
import { db, storage } from '../firebase/config';
import { notification } from '../function/appNotification';
import { currentDate } from '../function/currentDate';

const { width } = Dimensions.get('window');

export const Post = ({ navigation, posts, isProfilScreenActive }) => {
  const { userId, userImage } = useSelector((state) => state.auth);
  const [allComments, setAllComments] = useState([]);
  const [allLike, setAllLike] = useState([]);

  useEffect(() => {
    fetchAllComments();
    fetchAllLikes();
  }, []);

  const fetchAllComments = async () => {
    const comments = query(collectionGroup(db, 'comment'));
    await onSnapshot(comments, (snapshot) => {
      setAllComments(snapshot.docs.map((doc) => ({ ...doc.data() })));
    });
  };

  const countComments = (postId) => {
    const commentsById = allComments.filter(
      (comment) => comment.postId === postId
    );
    return commentsById.length;
  };

  const fetchAllLikes = async () => {
    const likes = query(collectionGroup(db, 'like'));
    await onSnapshot(likes, (snapshot) => {
      setAllLike(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  const createLike = async (postId) => {
    const docId = doc(db, 'posts', `${postId}`);
    const likeCollection = collection(docId, 'like');

    const likeFromUser = allLike.find(
      (item) => item.postId === postId && item.userId === userId
    );

    if (likeFromUser) {
      const likeId = likeFromUser.id;

      await deleteDoc(doc(db, `/posts/${postId}/like/${likeId}`));
    } else {
      const date = Date.now();
      await addDoc(likeCollection, {
        userId,
        postId,
        userImage,
        date,
      });
    }
  };

  const colorLike = (postId) => {
    const ifCommentAndlikeFromUser = allLike.find(
      (item) => item.postId === postId && item.userId === userId
    );

    if (ifCommentAndlikeFromUser) {
      return '#FF6C00';
    } else {
      return '#BDBDBD';
    }
  };
  const colorComment = (postId) => {
    const ifCommentFromUser = allComments.find(
      (item) => item.postId === postId && item.userId === userId
    );

    if (ifCommentFromUser) {
      return '#FF6C00';
    } else {
      return '#BDBDBD';
    }
  };

  const countlikes = (postId) => {
    const likeById = allLike.filter((like) => like.postId === postId);
    return likeById.length;
  };

  const showAvatarLikes = (postId) => {
    const likeById = allLike.filter((like) => like.postId === postId);
    const sortedAvatarArr = likeById.sort((x, y) => x.date - y.date).reverse();
    const avatarArr = [];
    sortedAvatarArr.map((avatar) => avatarArr.push(avatar.userImage));
    return avatarArr;
  };

  const deletePost = async (post) => {
    const { date, id } = post;

    await deleteDoc(doc(db, 'posts', `${id}`));

    const photoRef = ref(storage, `images/${date}`);
    deleteObject(photoRef)
      .then(() => {
        notification('Post deleted successfully', 'success');
      })
      .catch((error) => {
        notification(error.message.toString(), 'warning');
      });
  };

  const renderItem = ({ item, index }) => {
    if (index === 0)
      return (
        <Image
          source={{ uri: item }}
          style={{ ...styles.userImage, borderWidth: 1, borderColor: '#fff' }}
        />
      );
    else if (index > 0 && index < 3)
      return (
        <Image
          source={{ uri: item }}
          style={{
            ...styles.userImage,
            marginLeft: -5,
            borderWidth: 1,
            borderColor: '#fff',
          }}
        />
      );
    else return;
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, index) => item.id}
      renderItem={({ item }) => (
        <View style={styles.imageWrapper}>
          <View
            style={{
              ...styles.photoHeaderContainer,
              justifyContent: isProfilScreenActive
                ? 'flex-end'
                : 'space-between',
            }}
          >
            {!isProfilScreenActive && (
              <View style={styles.userInfoContainer}>
                <Image
                  source={{ uri: item.userImage }}
                  style={styles.userImage}
                />
                <Text style={styles.userLogin}>{item.login}</Text>
              </View>
            )}
            <Text style={styles.userLogin}>{currentDate(item.date)}</Text>
          </View>
          <ImageModal
            resizeMode="cover"
            modalImageStyle={{ resizeMode: 'contain' }}
            style={styles.image}
            source={{
              uri: item.photoURL,
            }}
          />
          <View>
            <Text style={styles.commentsText}>{item.comment}</Text>
          </View>
          <View style={styles.btnContainer}>
            <View style={styles.commentAndLikeContainer}>
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
                    color={colorComment(item.id)}
                  />
                  <Text
                    style={{
                      ...styles.commentText,
                      color: colorComment(item.id),
                    }}
                  >
                    {countComments(item.id)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.commentsBtn}
                onPress={() => createLike(item.id)}
              >
                <View style={styles.likeContainer}>
                  <EvilIcons name="like" size={24} color={colorLike(item.id)} />
                  <Text
                    style={{
                      ...styles.commentText,
                      color: colorLike(item.id),
                    }}
                  >
                    {countlikes(item.id)}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  marginLeft: 8,
                }}
              >
                <FlatList
                  data={showAvatarLikes(item.id)}
                  horizontal={true}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                />
              </View>
              {countlikes(item.id) >= 3 && (
                <TouchableOpacity
                  onPress={() =>
                    notification(
                      "Here will be appearing all the user's avatars that like soon.",
                      'warning'
                    )
                  }
                  activeOpacity={0.8}
                  style={{ marginLeft: 8 }}
                >
                  <EvilIcons name="chevron-right" size={24} color="#BDBDBD" />
                </TouchableOpacity>
              )}
            </View>
            <View>
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
          {isProfilScreenActive && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deletePost(item)}
            >
              <EvilIcons name="close-o" size={32} color="#FF6C00" />
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  photoHeaderContainer: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userImage: {
    width: 25,
    height: 25,
    borderRadius: 50,
  },
  userLogin: {
    color: '#212121',
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
  },
  imageWrapper: {
    marginTop: 16,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    height: 25,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#212121',
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  commentContainer: {
    flexDirection: 'row',
    marginRight: 24,
  },
  likeContainer: {
    flexDirection: 'row',
  },
  deleteBtn: {
    padding: 4,
    position: 'absolute',
    right: 0,
    top: 24,
  },
  commentText: {
    color: '#BDBDBD',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    marginLeft: 6,
  },
  commentAndLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
