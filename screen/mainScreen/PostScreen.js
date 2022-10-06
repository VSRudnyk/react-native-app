import { createStackNavigator } from '@react-navigation/stack';
import { CommentsScreen } from '../nestedScreen/CommentScreen';
import { DefaultScreenPosts } from '../nestedScreen/DefaultScreen';
import { MapScreen } from '../nestedScreen/MapScreen';

const NestedScreen = createStackNavigator();

export const PostScreen = () => {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen name="Публикации" component={DefaultScreenPosts} />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};
