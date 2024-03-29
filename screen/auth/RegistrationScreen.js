import { useState } from 'react';
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
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { authSignUpUser } from '../../redux/auth/authOperations';
import { Loader } from '../../components/Loader';
import { pickImage } from '../../function/pickImage';
import { notification } from '../../function/appNotification';

const initialState = {
  login: '',
  email: '',
  password: '',
  userImage: '',
};

export default function RegistrationScreen({ navigation }) {
  const dispatch = useDispatch();

  const defaultUserPhoto =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png';

  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(defaultUserPhoto);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    keyboardHide();
    if (userImage === defaultUserPhoto) {
      notification('Please, add your photo', 'warning');
      return;
    }
    setLoading(true);
    const photoURL = await uploadPhotoToServer();
    dispatch(authSignUpUser({ ...state, userImage: photoURL }, setLoading));
    setState(initialState);
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(userImage);
    const file = await response.blob();
    const userPhotoId = Date.now().toString();
    const storageRef = await ref(storage, `userImage/${userPhotoId}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    return photoURL;
  };

  const choseUserImage = async () => {
    const userPhoto = await pickImage();

    if (userPhoto) {
      setUserImage(userPhoto);
    } else {
      setUserImage(userImage);
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
            <View style={styles.background}>
              <View style={styles.photoContainer}>
                <TouchableOpacity activeOpacity={0.8} onPress={choseUserImage}>
                  <Image
                    source={{ uri: userImage }}
                    style={{ width: 120, height: 120, borderRadius: 16 }}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.registerTitle}>Регистрация</Text>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={'Логин'}
                  placeholderTextColor={'#BDBDBD'}
                  value={state.login}
                  cursorColor="#FF6C00"
                  onFocus={() => setIsShowKeyboard(true)}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder={'Адрес электронной почты'}
                  placeholderTextColor={'#BDBDBD'}
                  value={state.email}
                  keyboardType="email-address"
                  cursorColor="#FF6C00"
                  onFocus={() => setIsShowKeyboard(true)}
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
                  cursorColor="#FF6C00"
                  onFocus={() => setIsShowKeyboard(true)}
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
                  style={{
                    ...styles.loginBtn,
                    marginBottom: isShowKeyboard ? 16 : 80,
                  }}
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
      {loading && <Loader />}
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
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#F6F6F6',
    height: 50,
    borderRadius: 8,
    color: '#212121',
    padding: 16,
    marginBottom: 16,
    fontFamily: 'Roboto-Regular',
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
  },
  registerBtnText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto-Regular',
  },
  loginBtnText: {
    fontSize: 16,
    color: '#1B4371',
    fontFamily: 'Roboto-Regular',
  },
});
