import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/FontAwesome';

const Profile = () => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          throw new Error('No user is currently logged in');
        }

        const userDoc = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        } else {
          throw new Error('User data not found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!userData) {
    return <Text>No user data available</Text>;
  }



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
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <View className="mb-6 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
        <Text className="text-lg font-semibold mb-2">
          User ID: {userData.id}
        </Text>
        <Text className="text-lg font-semibold mb-2">
          Email: {userData.email}
        </Text>
        <Text className="text-lg font-semibold mb-2">
          Role: {userData.role}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        className="flex-row items-center bg-blue-500 px-4 py-2 rounded-md">
        <Icons name="sign-out" size={20} color="white" />
        <Text className="text-white font-bold ml-2">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
