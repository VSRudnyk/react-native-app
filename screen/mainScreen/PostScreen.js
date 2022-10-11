import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { CommentsScreen } from '../nestedScreen/CommentScreen';
import { DefaultScreenPosts } from '../nestedScreen/DefaultScreen';
import { MapScreen } from '../nestedScreen/MapScreen';

const NestedScreen = createStackNavigator();

export const PostScreen = () => {
  return (
    <NestedScreen.Navigator
      // screenOptions={{
      //   headerShown: false,
      // }}
      screenOptions={{
        headerStyle: {
          borderBottomWidth: 1,
          borderBottomColor: '#20b2aa',
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => console.log('Hello')}
            >
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        },
        headerTitleAlign: 'center',
      }}
    >
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreenPosts}
      />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};
