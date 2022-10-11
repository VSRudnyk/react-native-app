import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const Loader = () => (
  <View style={[StyleSheet.absoluteFillObject, styles.container]}>
    <ActivityIndicator size={100} color="#FF6C00" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 9999,
  },
});
