import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CommentsScreen } from '../nestedScreen/CommentScreen';
import { DefaultScreenPosts } from '../nestedScreen/DefaultScreen';
import { MapScreen } from '../nestedScreen/MapScreen';
import { authSignOutUser } from '../../redux/auth/authOperations';

const NestedScreen = createStackNavigator();

export const PostScreen = () => {
  const dispatch = useDispatch();

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
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={styles.signOutBtn}
              activeOpacity={0.8}
              onPress={() => dispatch(authSignOutUser())}
            >
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
        name="Публікації"
        component={DefaultScreenPosts}
      />
      <NestedScreen.Screen name="Коментарі" component={CommentsScreen} />
      <NestedScreen.Screen name="Мапа" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};

const styles = StyleSheet.create({
  signOutBtn: {
    marginRight: 16,
  },
});
