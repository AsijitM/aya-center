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
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Container = styled(View, 'flex-1 bg-white items-center justify-center');
const StyledImage = styled(Image, 'mb-10');
const InputView = styled(
  View,
  'bg-pink-200 rounded-3xl w-4/5 h-12 mb-5 items-center',
);
const TextInputStyled = styled(
  TextInput,
  'h-12 flex-1 p-3 ml-5 text-center text-black',
); // Added text-center for centering text
const LoginButton = styled(
  TouchableOpacity,
  'w-4/5 bg-pink-500 rounded-3xl h-12 items-center justify-center mt-10',
);
const LoginText = styled(Text, 'text-white font-bold');

export default function EnterPhoneNumberScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {confirmData, password, phone} = route.params;

  const submitOtp = async () => {
    setLoading(true);
    try {
      await confirmData.confirm(otp);
      const email = `${phone}@aya.com`;

      // Get current user
      const currentUser = auth().currentUser;

      // Link email and password credentials
      const credential = auth.EmailAuthProvider.credential(email, password);
      await currentUser.linkWithCredential(credential);
      const userData = {
        id: currentUser.uid,
        email,
        role: 'customer',
      };
      await firestore().collection('users').doc(currentUser.uid).set(userData);

      navigation.reset({
        index: 0,
        routes: [{name: 'Splash'}],
      });
      setLoading(false);

      // alert('Your number is verified');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <StyledImage source={require('../../assets/logo.png')} />
      <InputView>
        <TextInputStyled
          placeholder="Enter OTP"
          placeholderTextColor="#003f5c"
          onChangeText={value => setOtp(value)}
          keyboardType="numeric"
          maxLength={10}
        />
      </InputView>
      <LoginButton>
        <TouchableOpacity onPress={submitOtp} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <LoginText>Verify</LoginText>
          )}
        </TouchableOpacity>
      </LoginButton>
    </Container>
  );
}
