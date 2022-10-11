import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { authSignUpUser } from '../../redux/auth/authOperations';

const initialState = {
  login: '',
  email: '',
  password: '',
  userImage: '',
};

export default function RegistrationScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [dimensions, setdimensions] = useState(
    Dimensions.get('window').width - 20 * 2
  );
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get('window').width - 20 * 2;

      setdimensions(width);
    };
    Dimensions.addEventListener('change', onChange);
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const photoURL = await uploadPhotoToServer();
    // setState((prevState) => ({ ...prevState, userImage: photoURL }));
    // console.log('1', photoURL);
    // console.log('2', state);
    dispatch(authSignUpUser({ ...state, userImage: photoURL }));
    // setState(initialState);
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(userImage);

    const file = await response.blob();

    const uniquePostId = Date.now().toString();

    const storageRef = await ref(storage, `userImage/${uniquePostId}`);

    await uploadBytes(storageRef, file);

    const processedPhoto = await getDownloadURL(storageRef);

    return processedPhoto;
  };

  const pickImage = async () => {
    if (!userImage) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setUserImage(result.uri);
      }
    } else {
      setUserImage(null);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <ImageBackground
          style={styles.image}
          source={require('../../assets/image/bg-image.png')}
        >
          <KeyboardAvoidingView>
            <View
              style={{
                ...styles.background,
                marginBottom: isShowKeyboard ? 100 : 0,
              }}
            >
              <View style={styles.photoContainer}>
                <TouchableOpacity
                  style={{
                    ...styles.addPhoto,
                    transform: userImage
                      ? [{ rotate: '45deg' }]
                      : [{ rotate: '0deg' }],
                  }}
                  activeOpacity={0.8}
                  onPress={pickImage}
                >
                  <AntDesign
                    name="pluscircleo"
                    size={25}
                    color={userImage ? '#BDBDBD' : '#FF6C00'}
                  />
                </TouchableOpacity>
                {userImage && (
                  <Image
                    source={{ uri: userImage }}
                    style={{ width: 120, height: 120, borderRadius: 16 }}
                  />
                )}
              </View>
              <Text style={styles.registerTitle}>Регистрация</Text>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={'Логин'}
                  placeholderTextColor={'#BDBDBD'}
                  value={state.login}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder={'Адрес электронной почты'}
                  placeholderTextColor={'#BDBDBD'}
                  value={state.email}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder={'Пароль'}
                  secureTextEntry={true}
                  placeholderTextColor={'#BDBDBD'}
                  value={state.password}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
                <TouchableOpacity
                  style={styles.registerBtn}
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                >
                  <Text style={styles.registerBtnText}>Зарегистрироваться</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginBtnText}>
                    Уже есть аккаунт? Войти
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  background: {
    position: 'relative',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  formContainer: {
    marginHorizontal: 16,
  },
  photoContainer: {
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: [{ translateX: -60 }],
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  addPhoto: {
    position: 'absolute',
    bottom: 14,
    right: -12,
    zIndex: 999,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#F6F6F6',
    height: 50,
    borderRadius: 8,
    color: '#212121',
    padding: 16,
    marginBottom: 16,
    fontFamily: 'Roboto-Medium',
  },
  registerTitle: {
    fontSize: 30,
    color: '#212121',
    textAlign: 'center',
    marginTop: 92,
    marginBottom: 32,
    fontFamily: 'Roboto-Bold',
  },
  registerBtn: {
    borderRadius: 100,
    backgroundColor: '#FF6C00',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 27,
  },
  loginBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 80,
  },
  registerBtnText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto-Medium',
  },
  loginBtnText: {
    fontSize: 16,
    color: '#1B4371',
    fontFamily: 'Roboto-Medium',
  },
  linkText: {
    fontSize: 16,
    color: '#1B4371',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 80,
    fontFamily: 'Roboto-Medium',
  },
});
