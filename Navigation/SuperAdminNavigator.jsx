// navigation/BottomTabNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/FontAwesome';

import Bookings from '../screens/superAdmin/Bookings';
import Admins from '../screens/superAdmin/Admins';
import Workers from '../screens/superAdmin/Workers';

const Tab = createBottomTabNavigator();

const SuperAdminNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icons name="calendar-check-o" size={20} color="green" />
          ),
        }}
      />
      <Tab.Screen
        name="Admins"
        component={Admins}
        options={{
          tabBarIcon: () => <Icons name="user-plus" size={20} color="green" />,
        }}
      />
      <Tab.Screen
        name="Workers"
        component={Workers}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icons name="address-book-o" size={20} color="green" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default SuperAdminNavigator;
