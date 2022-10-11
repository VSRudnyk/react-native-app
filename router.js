import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import LoginScreen from './screen/auth/LoginScreen';
import RegistrationScreen from './screen/auth/RegistrationScreen';
import { PostScreen } from './screen/mainScreen/PostScreen';
import { CreateScreen } from './screen/mainScreen/CreateScreen';
import { ProfileScreen } from './screen/mainScreen/ProfileScreen';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const AuthStack = createStackNavigator();
const MainTab = createMaterialBottomTabNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={LoginScreen}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Register"
          component={RegistrationScreen}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainTab.Navigator
      labeled={false}
      barStyle={{ backgroundColor: '#fff', height: 83 }}
      activeColor="#FF6C00"
      inactiveColor="#212121CC"
    >
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="grid-outline" size={25} color={color} />
          ),
        }}
        name="Posts"
        component={PostScreen}
      />

      <MainTab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="add" size={25} color={color} />
          ),
        }}
        name="Create"
        component={CreateScreen}
      />
      <MainTab.Screen
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <AntDesign name="user" size={25} color={color} />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
};
