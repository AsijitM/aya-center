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
import {StackActions, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Container = styled(View, 'flex-1 bg-white items-center justify-center');
const StyledImage = styled(Image, 'mb-10');
const InputView = styled(
  View,
  'bg-pink-200 rounded-3xl w-4/5 h-12 mb-5 items-center',
);
const TextInputStyled = styled(TextInput, 'h-12 flex-1 p-3 ml-5');
const ForgotButton = styled(TouchableOpacity, 'h-7 mb-7');
const ForgotText = styled(Text, 'text-blue-500');
const LoginButton = styled(
  TouchableOpacity,
  'w-4/5 bg-pink-500 rounded-3xl h-12 items-center justify-center mt-10',
);
const LoginText = styled(Text, 'text-white font-bold');

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (phone.length > 0 && password.length > 0) {
        const email = `${phone}@aya.com`;
        // const email = phone
        console.log(email);
        const user = await auth().signInWithEmailAndPassword(email, password);
        console.log(user);
        navigation.dispatch(StackActions.replace('Splash'));
        setLoading(false);
        // setMessage('');
      } else {
        alert('Email or Password cannot be left empty');
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledImage source={require('../../assets/logo.png')} />
      <InputView>
        <TextInputStyled
          placeholder="Enter Phone Number"
          placeholderTextColor="#003f5c"
          onChangeText={phone => setPhone(phone)}
        />
      </InputView>
      <InputView>
        <TextInputStyled
          placeholder="Enter Password"
          placeholderTextColor="#003f5c"
          onChangeText={password => setPassword(password)}
          secureTextEntry={true}
        />
      </InputView>
      <ForgotButton>
        <TouchableOpacity onPress={() => navigation.navigate('phone')}>
          <ForgotText>Create New Account ?</ForgotText>
        </TouchableOpacity>
      </ForgotButton>
      <LoginButton>
        <TouchableOpacity onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <LoginText>Login</LoginText>
          )}
        </TouchableOpacity>
      </LoginButton>
    </Container>
  );
}
