import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import EnterPhoneNumberScreen from '../screens/Auth/PhoneNumberScreen';
import OTPVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import BottomTabNavigator from './BottomNavigator';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="phone"
        component={EnterPhoneNumberScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="otp"
        component={OTPVerificationScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
