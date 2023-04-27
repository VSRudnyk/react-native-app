import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LoginScreen from './screen/auth/LoginScreen';
import RegistrationScreen from './screen/auth/RegistrationScreen';
import { PostScreen } from './screen/mainScreen/PostScreen';
import { CreateScreen } from './screen/mainScreen/CreateScreen';
import { ProfileScreen } from './screen/mainScreen/ProfileScreen';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

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
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;
          let rn = route.name;

          if (rn === 'Posts') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (rn === 'Create') {
            iconName = focused ? 'add' : 'add-outline';
          } else if (rn === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: '#FF6C00',
        tabBarInactiveTintColor: '#212121CC',
        tabBarShowLabel: false,
        headerShown: false,
        // tabBarStyle: { display: 'none' }, // Скрыть нижний tabBar
      })}
    >
      <MainTab.Screen name="Posts" component={PostScreen} />
      <MainTab.Screen name="Create" component={CreateScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
};
