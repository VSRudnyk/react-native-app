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
  LogBox,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { authSignInUser } from '../../redux/auth/authOperations';
import { Loader } from '../../components/Loader';

const initialState = {
  email: '',
  password: '',
};

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  LogBox.ignoreLogs(['Remote debugger']);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    keyboardHide();
    setLoading(true);
    dispatch(authSignInUser(state, setLoading));
    setState(initialState);
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
              }}
            >
              <Text style={styles.registerTitle}>Войти</Text>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={'Адрес электронной почты'}
                  placeholderTextColor={'#BDBDBD'}
                  value={state.email}
                  cursorColor="#FF6C00"
                  keyboardType="email-address"
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
                  style={styles.loginBtn}
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                >
                  <Text style={styles.loginBtnText}>Войти</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.registerBtn,
                    marginBottom: isShowKeyboard ? 16 : 80,
                  }}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.registerBtnText}>
                    Нет аккаунта? Зарегистрироваться
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  formContainer: {
    marginHorizontal: 16,
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
    marginTop: 32,
    marginBottom: 32,
    fontFamily: 'Roboto-Bold',
  },
  loginBtn: {
    borderRadius: 100,
    backgroundColor: '#FF6C00',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 27,
  },
  registerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginBtnText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Roboto-Regular',
  },
  registerBtnText: {
    fontSize: 16,
    color: '#1B4371',
    fontFamily: 'Roboto-Regular',
  },
});
