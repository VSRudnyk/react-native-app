import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { storage } from '../../firebase/config';
import { db } from '../../firebase/config';
import { notification } from '../../components/Notification';

export const DeffultCameraScreen = ({ route, navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (route.params) {
      setPhoto(route.params);
    }
  }, [route.params]);

  const { userId, login } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(location.coords);

      await setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        country: address[0].country,
        city: address[0].city,
        subregion: address[0].subregion,
      });

      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const sendPhoto = () => {
    navigation.navigate('Публікації');
    uploadPostToServer();
    setPhoto(null);
    setComment(null);
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    await addDoc(collection(db, 'posts'), {
      photo,
      comment,
      location,
      userId,
      login,
    });
  };

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(photo);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();
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
              onPress={() => navigation.navigate('CameraScreen')}
              style={styles.takePhotoBtn}
            >
              <FontAwesome name="camera" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.takePhotoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setComment}
            placeholder="Назва..."
            placeholderTextColor={'#BDBDBD'}
          />
        </View>
        <TouchableOpacity
          onPress={sendPhoto}
          style={{
            ...styles.sendBtn,
            backgroundColor: photo ? '#FF6C00' : '#F6F6F6',
          }}
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
  inputContainer: {},
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#212121',
    marginBottom: 32,
  },
});
