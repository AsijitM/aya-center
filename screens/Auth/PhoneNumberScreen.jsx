import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {styled} from 'nativewind';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Container = styled(View, 'flex-1 bg-white items-center justify-center');
const StyledImage = styled(Image, 'mb-10');
const InputView = styled(
  View,
  'bg-pink-200 rounded-3xl w-4/5 h-12 mb-5 items-center',
);
const TextInputStyled = styled(
  TextInput,
  'h-12 flex-1 p-3 ml-5 text-center text-black',
);
const ForgotButton = styled(TouchableOpacity, 'h-7 mb-7');
const ForgotText = styled(Text, 'text-blue-500');
const LoginButton = styled(
  TouchableOpacity,
  'w-4/5 bg-pink-500 rounded-3xl h-12 items-center justify-center mt-10',
);
const LoginText = styled(Text, 'text-white font-bold');

export default function EnterPhoneNumberScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  // const [isFocused, setIsFocused] = useState(false);

  const sendOtp = async () => {
    setLoading(true);
    try {
      const mobile = '+91' + phone;
      console.log(mobile);
      const response = await auth().signInWithPhoneNumber(mobile);
      setTimeout(() => {
        navigation.navigate('otp', {confirmData: response, password, phone});
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <StyledImage source={require('../../assets/logo.png')} />
      <InputView>
        <TextInputStyled
          placeholder="Enter Phone Number"
          placeholderTextColor="#003f5c"
          onChangeText={value => setPhone(value)}
          value={phone}
          keyboardType="numeric"
        />
      </InputView>
      <InputView>
        <TextInputStyled
          placeholder="Enter Password"
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry={true}
        />
      </InputView>
      <ForgotButton>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <ForgotText>Already Have account?</ForgotText>
        </TouchableOpacity>
      </ForgotButton>
      <LoginButton>
        <TouchableOpacity onPress={sendOtp} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <LoginText>Send OTP</LoginText>
          )}
        </TouchableOpacity>
      </LoginButton>
    </Container>
  );
}
