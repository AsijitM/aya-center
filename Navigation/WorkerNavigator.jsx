// navigation/BottomTabNavigator.js
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const WorkerNavigator = ({route}) => {
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
    </Tab.Navigator>
  );
};

export default WorkerNavigator;
