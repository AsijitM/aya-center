// navigation/BottomTabNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/FontAwesome';

import OrderHistory from '../screens/customer/OrderHistory';
import UpcomingBookings from '../screens/customer/UpcomingBookings';
import Profile from '../screens/customer/Profile';

const Tab = createBottomTabNavigator();

const WorkerNavigator = ({route}) => {
  const {userRole} = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Booking"
        component={UpcomingBookings}
        options={{
          tabBarIcon: () => <Icons name="clock-o" size={20} color="#3b82f6" />,
          headerShown: false,
        }}
        initialParams={{userRole}}
      />
      <Tab.Screen
        name="History"
        component={OrderHistory}
        options={{
          tabBarIcon: () => <Icons name="clock-o" size={20} color="#3b82f6" />,
          headerShown: false,
        }}
        initialParams={{userRole}}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => <Icons name="smile-o" size={20} color="#3b82f6" />,
          headerShown: false,
        }}
        initialParams={{userRole}}
      />
    </Tab.Navigator>
  );
};

export default WorkerNavigator;
