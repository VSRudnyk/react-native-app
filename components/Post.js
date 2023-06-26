import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { collectionGroup, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { PostRenderItem } from './PostRenderItem';

export const Post = ({ navigation, posts, isProfilScreenActive }) => {
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

  const fetchAllLikes = async () => {
    const likes = query(collectionGroup(db, 'like'));
    await onSnapshot(likes, (snapshot) => {
      setAllLike(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, index) => item.id}
      renderItem={({ item }) => (
        <PostRenderItem
          navigation={navigation}
          isProfilScreenActive={isProfilScreenActive}
          allComments={allComments}
          allLike={allLike}
          item={item}
        />
      )}
    />
  );
};
