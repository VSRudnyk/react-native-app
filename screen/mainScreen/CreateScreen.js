import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

export const CreateScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
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
    navigation.navigate('Posts', { photo });
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
});
