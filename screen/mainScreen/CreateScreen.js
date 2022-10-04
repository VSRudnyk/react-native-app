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
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage } from '../../firebase/config';
import { db } from '../../firebase/config';

export const CreateScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [comment, setComment] = useState('');
  const isFocused = useIsFocused();

  const { userId, login } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (camera) {
      const NewPhoto = await camera.takePictureAsync(null);
      setPhoto(NewPhoto.uri);
    }

    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
  };

  const sendPhoto = () => {
    navigation.navigate('DefaultScreen');
    uploadPostToServer();
    setPhoto(null);
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    await addDoc(collection(db, 'posts'), {
      photo,
      comment,
      location: location.coords,
      userId,
      login,
    });
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);

    const file = await response.blob();

    const uniquePostId = Date.now().toString();

    const storageRef = await ref(storage, `images/${uniquePostId}`);

    await uploadBytes(storageRef, file);

    const processedPhoto = await getDownloadURL(storageRef);
    return processedPhoto;
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <View style={styles.cameraWrapper}>
          <Camera style={styles.camera} ref={(ref) => setCamera(ref)}>
            {photo && (
              <View style={styles.takePhotoContainer}>
                <Image
                  source={{ uri: photo }}
                  style={{ height: 200, width: 200, borderRadius: 10 }}
                />
              </View>
            )}
            <TouchableOpacity onPress={takePhoto} style={styles.button}>
              <Text style={styles.snapText}>Snap</Text>
            </TouchableOpacity>
          </Camera>
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} onChangeText={setComment} />
      </View>
      <TouchableOpacity onPress={sendPhoto} style={styles.sendBtn}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraWrapper: {
    height: '70%',
    marginHorizontal: 10,
    marginTop: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  camera: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'red',
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  },
  snapText: {
    color: '#fff',
  },
  sendText: {
    color: '#20b2aa',
    fontSize: 20,
  },
  takePhotoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
  },
  inputContainer: {
    marginHorizontal: 10,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#20b2aa',
  },
});
