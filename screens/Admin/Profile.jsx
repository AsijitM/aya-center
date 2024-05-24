import {View, Text, Button} from 'react-native';
import React from 'react';
import Icons from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

export default function ProfileAdmin() {
  const navigation = useNavigation();
  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.replace('auth'); // Navigate back to Login screen
      console.log('Logged out');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Icons name="plane" size={20} color="green" className="mb-10" />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
