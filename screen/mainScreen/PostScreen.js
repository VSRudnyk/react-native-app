import { createStackNavigator } from '@react-navigation/stack';
import { CommentScreen } from '../nestedScreen/CommentScreen';
import { DefaultScreenPosts } from '../nestedScreen/DefaultScreen';
import { MapScreen } from '../nestedScreen/MapScreen';

const NestedScreen = createStackNavigator();

export const PostScreen = () => {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreenPosts}
      />
      <NestedScreen.Screen name="Comment" component={CommentScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
};
