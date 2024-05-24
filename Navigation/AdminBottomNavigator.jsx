// navigation/BottomTabNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/customer/UpcomingBookings';
import Profile from '../screens/customer/Profile';
import Bookings from '../screens/Admin/Bookings';
import Workers from '../screens/Admin/Workers';
import ProfileAdmin from '../screens/Admin/Profile';

const Tab = createBottomTabNavigator();

const AdminBottomNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarIcon: () => <Icons name="clock-o" size={20} color="#3b82f6" />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Workers"
        component={Workers}
        options={{
          tabBarIcon: () => (
            <Icons name="address-book-o" size={20} color="green" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileAdmin}
        options={{
          tabBarIcon: () => <Icons name="smile-o" size={20} color="green" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminBottomNavigator;
