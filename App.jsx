import React, {useEffect} from 'react';
import MainNavigator from './Navigation/MainNavigator';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { requestUserPermission } from './utilities/notificationService';



export default function App() {
useEffect(() => {
  const unsubscribe = auth().onAuthStateChanged(async user => {
    if (user) {
      const fcmToken = await requestUserPermission();
      if (fcmToken) {
        await firestore().collection('users').doc(user.uid).update({
          fcmToken: fcmToken,
        });
      }
    }
  });

  return () => unsubscribe();
}, []);
  return <MainNavigator />;
}
