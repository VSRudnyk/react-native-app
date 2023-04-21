import { showMessage } from 'react-native-flash-message';

export const notification = (text, type) => {
  return showMessage({
    message: text,
    type: type,
    duration: 5000,
    statusBarHeight: 50,
    floating: true,
    titleStyle: {
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
      textAlign: 'center',
    },
  });
};
