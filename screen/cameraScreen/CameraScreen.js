// import { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Camera } from 'expo-camera';
// import { useIsFocused } from '@react-navigation/native';

// export const CameraScreen = ({ navigation }) => {
//   const [camera, setCamera] = useState(null);

//   const isFocused = useIsFocused();

// const takePhoto = async () => {
//   if (camera) {
//     const NewPhoto = await camera.takePictureAsync(null);
//     navigation.navigate({
//       name: ' публікацію',
//       params: NewPhoto.uri,
//     });
//   }
// };

//   return (
//     <View style={styles.container}>
//       {isFocused && (
//         <View style={styles.cameraWrapper}>
//           <Camera style={styles.camera} ref={(ref) => setCamera(ref) }>
// <TouchableOpacity onPress={takePhoto} style={styles.button}>
//   <Text style={styles.snapText}>Snap</Text>
// </TouchableOpacity>
//           </Camera>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   cameraWrapper: {
//     height: '60%',
//     marginHorizontal: 10,
//     marginTop: 40,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   camera: {
//     height: '100%',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
// button: {
//   borderRadius: 50,
//   borderWidth: 1,
//   borderColor: 'red',
//   height: 80,
//   width: 80,
//   alignItems: 'center',
//   justifyContent: 'center',
//   marginBottom: 20,
// },
// });

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

export const CameraScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);

  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status == 'granted');
    }
    getCameraStatus();
  }, []);

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

  const takePhoto = async () => {
    if (camera) {
      const NewPhoto = await camera.takePictureAsync(null);
      navigation.navigate({
        name: 'Створити публікацію',
        params: NewPhoto.uri,
      });
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <Text>Waiting for camera permissions</Text>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Camera
          style={[
            styles.cameraPreview,
            { marginTop: imagePadding, marginBottom: imagePadding },
          ]}
          onCameraReady={setCameraReady}
          ratio={ratio}
          ref={(ref) => {
            setCamera(ref);
          }}
        >
          <TouchableOpacity onPress={takePhoto} style={styles.button}>
            <Text style={styles.snapText}>Snap</Text>
          </TouchableOpacity>
        </Camera>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
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
    borderWidth: 1,
    borderColor: 'red',
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
