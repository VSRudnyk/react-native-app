import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { db } from '../../firebase/config';
import { Post } from '../../components/Post';

export const DefaultScreenPosts = ({ navigation }) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    getAllPosts();
  }, [isFocused]);

  const [posts, setPosts] = useState([]);

  const getAllPosts = async () => {
    const colRef = collection(db, 'posts');

    await onSnapshot(colRef, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  const sortPosts = posts.sort((x, y) => x.date - y.date).reverse();

  console.log(sortPosts);

  return (
    <View style={styles.container}>
      <Post posts={sortPosts} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
