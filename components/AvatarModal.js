import { View, StyleSheet, Image, FlatList } from 'react-native';
import { Overlay } from '@rneui/themed';

export const AvatarModal = ({ togleModal, visible, showAvatar, postId }) => {
  return (
    <>
      <Overlay
        isVisible={visible}
        onBackdropPress={togleModal}
        overlayStyle={{ display: 'none' }}
        backdropStyle={{ backgroundColor: 'transparent' }}
      ></Overlay>
      <View
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 30,
          zIndex: 999,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: '#fff',
          padding: 10,
        }}
      >
        <FlatList
          data={showAvatar(postId)}
          numColumns={5}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.userImage} />
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  userImage: {
    width: 25,
    height: 25,
    borderRadius: 50,
    margin: 4,
  },
});
