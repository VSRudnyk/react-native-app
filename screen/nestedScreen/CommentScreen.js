import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { db } from '../../firebase/config';
import { currentDate } from '../../function/currentDate';

export const CommentsScreen = ({ route, navigation }) => {
  const { postId, photo } = route.params;
  const [comment, setComment] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const { login, userImage, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    getCommentById();
  }, []);

  const createPost = async () => {
    const date = currentDate();
    const docId = doc(db, 'posts', `${postId}`);
    const commentCollection = collection(docId, 'comment');

    await addDoc(commentCollection, {
      comment,
      login,
      userImage,
      userId,
      postId,
      date,
    });
    setComment('');
  };

  const getCommentById = async () => {
    const docId = doc(db, 'posts', `${postId}`);
    const commentCollection = collection(docId, 'comment');
    await onSnapshot(commentCollection, (snapshot) => {
      setAllComments(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo }} style={styles.image} />
      <FlatList
        data={allComments}
        renderItem={({ item }) => (
          <View
            style={{
              ...styles.commentContainer,
              flexDirection: userId === item.userId ? 'row' : 'row-reverse',
            }}
          >
            <Image
              source={{ uri: item.userImage }}
              style={{
                ...styles.userImage,
                marginRight: userId === item.userId ? 16 : 0,
                marginLeft: userId === item.userId ? 0 : 16,
              }}
            />
            <View style={styles.textCommentContainer}>
              <Text style={styles.textComment}>{item.comment}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.input}
          placeholder={'Коментувати...'}
          placeholderTextColor={'#BDBDBD'}
          value={comment}
          onChangeText={(value) => setComment(value)}
        />
        <TouchableOpacity
          onPress={createPost}
          style={styles.sendBtn}
          disabled={!comment}
        >
          <AntDesign name="arrowup" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  image: {
    minWidth: 100,
    height: 240,
    marginTop: 32,
    marginBottom: 32,
    borderRadius: 8,
  },
  commentContainer: {
    marginBottom: 24,
  },
  userImage: {
    width: 28,
    height: 28,
    borderRadius: 100,
  },
  textCommentContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 16,
    borderBottomLeftRadius: 6,
    borderBottomEndRadius: 6,
    borderTopRightRadius: 6,
  },
  textComment: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    paddingBottom: 8,
  },
  date: {
    fontSize: 10,
    fontFamily: 'Roboto-Regular',
    color: '#BDBDBD',
    textAlign: 'right',
  },
  addCommentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  sendBtn: {
    height: 34,
    width: 34,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
  },
  input: {
    flex: 1,
    borderRadius: 100,
    height: 50,
    backgroundColor: '#E8E8E8',
    paddingLeft: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});
