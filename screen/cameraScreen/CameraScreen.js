import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Camera } from 'expo-camera';
import { notification } from '../../function/appNotification';
import * as ScreenOrientation from 'expo-screen-orientation';

export const CameraScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [orientation, setOrientation] = useState(1);

  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status == 'granted');
    }
    getCameraStatus();
    ScreenOrientation.addOrientationChangeListener(getCurrentOrientation);
  }, []);

  useEffect(() => {
    return () => {
      ScreenOrientation.removeOrientationChangeListener(getCurrentOrientation);
    };
  });

  const getCurrentOrientation = async () => {
    const initOrientation = await ScreenOrientation.getOrientationAsync();
    setOrientation(initOrientation);
  };

  const prepareRatio = async () => {
    let desiredRatio = '4:3';
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      desiredRatio = minDistance;
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      setImagePadding(remainder);
      setRatio(desiredRatio);
      setIsRatioSet(true);
    }
  };

  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  const getCurrentOrientationAsync = async () => {
    return await ScreenOrientation.getOrientationAsync();
  };

  const takePhoto = async () => {
    if (camera) {
      const NewPhoto = await camera.takePictureAsync(null);
      navigation.navigate({
        name: 'Створити публікацію',
        params: NewPhoto.uri,
      });
    }
  };

  if (hasCameraPermission === false) {
    notification('No access to camera', 'warning');
  } else {
    return (
      <View style={styles.container}>
        <Camera
          style={[
            styles.cameraPreview,
            {
              marginTop: orientation === 1 ? 100 : 0,
              marginBottom: orientation === 1 ? 100 : 0,
              marginLeft: orientation === 4 ? 50 : 0,
              marginRight: orientation === 4 ? 70 : 0,
              justifyContent: orientation === 1 ? 'flex-end' : 'center',
              alignItems: orientation === 1 ? 'center' : 'flex-end',
            },
          ]}
          onCameraReady={setCameraReady}
          ratio={ratio}
          ref={(ref) => {
            setCamera(ref);
          }}
        >
          <TouchableOpacity
            onPress={takePhoto}
            style={{
              ...styles.button,
              marginBottom: orientation === 1 ? 20 : 0,
              marginRight: orientation === 4 ? 20 : 0,
            }}
          >
            <Text style={styles.snapText}>Snap</Text>
          </TouchableOpacity>
        </Camera>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  cameraPreview: {
    flex: 1,
  },
  button: {
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FF6C00',
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapText: {
    color: '#FF6C00',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
});
