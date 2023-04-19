import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

export const CommentsScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const { login, userImage } = useSelector((state) => state.auth);

  useEffect(() => {
    getCommentById();
  }, []);

  const createPost = async () => {
    const docId = doc(db, 'posts', `${postId}`);
    const commentCollection = collection(docId, 'comment');
    await addDoc(commentCollection, {
      comment,
      login,
      userImage,
      postId,
    });
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
      <SafeAreaView>
        <FlatList
          data={allComments}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Image
                source={{ uri: item.userImage }}
                style={{ width: 60, height: 60, borderRadius: 10 }}
              />
              <Text>{item.login}</Text>
              <Text>{item.comment}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
      <View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} onChangeText={setComment} />
        </View>
        <TouchableOpacity onPress={createPost} style={styles.sendBtn}>
          <Text style={styles.sendText}>Add post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  commentContainer: {
    borderWidth: 1,
    borderColor: '#20b2aa',
    marginHorizontal: 10,
    padding: 10,
    marginBottom: 10,
  },
  sendBtn: {
    marginHorizontal: 30,
    height: 40,
    borderWidth: 2,
    borderColor: '#20b2aa',
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#20b2aa',
  },
});
