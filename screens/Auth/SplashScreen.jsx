import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          navigation.replace('auth');
          return;
        }

        const userDoc = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData.role === 'admin') {
            navigation.replace('AdminStack');
          } else if (userData.role === 'customer') {
            navigation.replace('CustomerStack');
          } else if (userData.role === 'superadmin') {
            navigation.replace('superAdminStack');
          } else if (userData.role === 'worker') {
            navigation.replace()
          } else {
            throw new Error('Unknown role');
          }
        } else {
          throw new Error('User data not found');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        navigation.replace('auth');
      } finally {
        setLoading(false);
      }
    };

    checkVerificationStatus();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SplashScreen;
