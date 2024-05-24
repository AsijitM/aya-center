import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import EnterPhoneNumberScreen from '../screens/Auth/PhoneNumberScreen';
import OTPVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import BottomTabNavigator from './BottomNavigator';
import AuthStack from './AuthStackNavigator';
import AdminBottomNavigator from './AdminBottomNavigator';
import superAdminBottomNavigator from './SuperAdminNavigator';
import SuperAdminNavigator from './SuperAdminNavigator';
import BookingScreen from '../screens/customer/BookingScreen';
import BookingDetailsScreen from '../screens/customer/BookingsDetails';
import WorkerNavigator from './WorkerNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="auth"
          component={AuthStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CustomerStack"
          component={BottomTabNavigator}
          options={{headerShown: false}}
          initialParams={{userRole: 'customer'}}
        />
        <Stack.Screen
          name="AdminStack"
          component={AdminBottomNavigator}
          options={{headerShown: false}}
          initialParams={{userRole: 'admin'}}
        />
        <Stack.Screen
          name="superAdminStack"
          component={SuperAdminNavigator}
          options={{headerShown: false}}
          initialParams={{userRole: 'superadmin'}}
        />
        <Stack.Screen
          name="workerStack"
          component={WorkerNavigator}
          options={{headerShown: false}}
          initialParams={{userRole: 'worker'}}
        />
        <Stack.Screen
          name="newBooking"
          component={BookingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingDetails"
          component={BookingDetailsScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
