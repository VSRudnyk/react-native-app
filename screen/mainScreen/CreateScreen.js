import { createStackNavigator } from '@react-navigation/stack';
import { CameraScreen } from '../cameraScreen/CameraScreen';
import { DeffultCameraScreen } from '../cameraScreen/DeffultCameraScreen';

const NestedScreen = createStackNavigator();

export const CreateScreen = () => {
  return (
    <NestedScreen.Navigator
      screenOptions={{
        headerStyle: {
          borderBottomWidth: 1,
          borderBottomColor: '#BDBDBD',
        },
        headerTitleAlign: 'center',
      }}
    >
      <NestedScreen.Screen
        name="Створити публікацію"
        component={DeffultCameraScreen}
      />
      <NestedScreen.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ headerShown: false }} // Скрыть Header
      />
    </NestedScreen.Navigator>
  );
};
