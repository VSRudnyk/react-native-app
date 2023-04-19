import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

export const CameraScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);

  const isFocused = useIsFocused();

  const takePhoto = async () => {
    if (camera) {
      const NewPhoto = await camera.takePictureAsync(null);
      navigation.navigate({
        name: 'Створити публікацію',
        params: NewPhoto.uri,
      });
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <View style={styles.cameraWrapper}>
          <Camera style={styles.camera} ref={(ref) => setCamera(ref)}>
            <TouchableOpacity onPress={takePhoto} style={styles.button}>
              <Text style={styles.snapText}>Snap</Text>
            </TouchableOpacity>
          </Camera>
        </View>
      )}
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
});
