// navigation/BottomTabNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/customer/UpcomingBookings';
import Profile from '../screens/customer/Profile';
import OrderHistory from '../screens/customer/OrderHistory';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({route}) => {
  const {userRole} = route.params;
  console.log(userRole);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Booking"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Icons name="clock-o" size={20} color="#3b82f6" />,
          headerShown: false,
        }}
        initialParams={{userRole}}
      />

      <Tab.Screen
        name="Orders"
        component={OrderHistory}
        options={{
          tabBarIcon: () => <Icons name="history" size={20} color="#3b82f6" />,
          headerShown: false,
        }}
        initialParams={{userRole}}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: () => <Icons name="smile-o" size={20} color="#3b82f6" />,
        }}
        initialParams={{userRole}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
