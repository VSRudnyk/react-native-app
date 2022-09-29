import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Button, Text } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

export const DefaultScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  let x = [];

  const getAllPosts = async () => {
    const colRef = collection(db, 'posts');

    onSnapshot(colRef, (data) => {
      data.docs.map((doc) => {
        x.push({ ...doc.data(), id: doc.id });
      });
    });
    console.log(x);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{x.photoUrl}</Text>
      <FlatList
        data={x}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.photoUrl }} style={styles.image} />
          </View>
        )}
      />
      <Button title="go to map" onPress={() => navigation.navigate('Map')} />
      <Button
        title="go to comments"
        onPress={() => navigation.navigate('Comments')}
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
