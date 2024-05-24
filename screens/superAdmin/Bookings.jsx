import {View, Text, Button} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function Bookings() {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.replace('auth');
      console.log('Logged out');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
