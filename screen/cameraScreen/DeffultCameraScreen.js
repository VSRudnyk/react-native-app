import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { storage } from '../../firebase/config';
import { db } from '../../firebase/config';
import { notification } from '../../function/appNotification';

export const DeffultCameraScreen = ({ route, navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (route.params) {
      setPhoto(route.params);
    }
  }, [route.params]);

  const { userId, login, userImage } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        notification('Permission to access location was denied', 'warning');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(location.coords);
      const { country, city, subregion } = address[0];

      await setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        country: country,
        city: city,
        subregion: subregion,
      });
    })();
  }, [isFocused]);

  const sendPhoto = () => {
    Keyboard.dismiss();
    navigation.navigate('Публікації');
    uploadPostToServer();
    setPhoto(null);
    setComment(null);
  };

  const uploadPostToServer = async () => {
    const uniquePostId = Date.now();
    const photoURL = await uploadPhotoToServer(uniquePostId);

    await addDoc(collection(db, 'posts'), {
      photoURL,
      comment,
      location,
      userId,
      userImage,
      login,
      date: uniquePostId,
    });
  };

  const uploadPhotoToServer = async (uniquePostId) => {
    try {
      const response = await fetch(photo);
      const file = await response.blob();
      const storageRef = await ref(storage, `images/${uniquePostId}`);
      await uploadBytes(storageRef, file);
      const processedPhoto = await getDownloadURL(storageRef);
      return processedPhoto;
    } catch (error) {
      notification(error.message.toString(), 'warning');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.createPublication}>
        {!photo ? (
          <View style={styles.takePhotoContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CameraScreen')}
              style={styles.takePhotoBtn}
            >
              <FontAwesome name="camera" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.takePhotoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.retakePhotoBtn}
              onPress={() => setPhoto(null)}
            >
              <MaterialCommunityIcons
                name="camera-retake"
                size={32}
                color="#FF6C00"
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={(value) => setComment(value)}
            placeholder="Назва..."
            cursorColor="#FF6C00"
            placeholderTextColor={'#BDBDBD'}
          />
          <Text style={styles.input}>
            {location && `${location.city}, ${location.country}`}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={sendPhoto}
          style={{
            ...styles.sendBtn,
            backgroundColor: photo ? '#FF6C00' : '#F6F6F6',
          }}
          disabled={photo === null || location === ''}
        >
          <Text
            style={{ ...styles.sendText, color: photo ? '#fff' : '#BDBDBD' }}
          >
            Опублікувати
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  createPublication: {
    marginHorizontal: 16,
  },
  sendBtn: {
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  snapText: {
    color: '#fff',
  },
  sendText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  takePhotoContainer: {
    height: 240,
    marginTop: 32,
    marginBottom: 32,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  takePhotoBtn: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    height: '100%',
    width: '100%',
  },
  retakePhotoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#212121',

    paddingBottom: 8,
    textAlignVertical: 'bottom',
  },
  'input: :not(last-child)': {
    marginBottom: 16,
  },
});
