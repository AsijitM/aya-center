import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/AntDesign';

export default function OrderHistory() {
  const [history, setHistory] = useState([]);

  const fetchBookings = async () => {
    try {
      const user = auth().currentUser;
      const todayDate = new Date();
      const todayDateString = todayDate.toISOString().split('T')[0];
      const bookingsCollection = firestore().collection('bookings'); //
      const querySnapshot = await bookingsCollection
        .where('customer_id', '==', user.uid)
        .where('date', '<', todayDateString)
        .get(); // Fetch all documents

      const fetchedBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(), // Spread the document data for each booking
      }));

      setHistory(fetchedBookings); // Update the bookings state with fetched data
    } catch (error) {
      console.error('Error fetching history:', error); // Log the error for debugging
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, []),
  );
  const truncateDescription = description => {
    return description.length > 20
      ? description.substring(0, 30) + '...'
      : description;
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-3xl font-bold m-3 text-gray-700">
        Booking History
      </Text>
      <ScrollView className="flex-1 p-2">
        {history.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            className={`p-3 border-2 ${
              item.status === 'finished' ? 'border-green-500' : 'border-red-500'
            } border-l-8 flex-row items-center rounded-lg shadow-md mt-3`}
            onPress={() => handleBookingDetails(item.id)}>
            <View className="flex-1">
              <Text className="text-md font-semibold pb-1">
                {item.location}
              </Text>
              <View className="flex-row justify-between">
                <Text className="text-lg font-semibold text-black pb-1">
                  {truncateDescription(item.description)}
                </Text>
              </View>
              {/* <Text className="text-gray-600">
                {item.startTime} - {item.endTime}
              </Text> */}

              {item.status == 'finished' ? (
                <View className="flex-row justify-between">
                  <Text
                    className={`font-medium ${
                      item.status === 'finished'
                        ? 'text-green-700  '
                        : 'text-red-700'
                    } pb-2`}>
                    Finished
                  </Text>
                  <Icons name="checkcircleo" size={23} color="#22c55e" />
                </View>
              ) : (
                <View className="flex-row justify-between">
                  <Text
                    className={`font-medium ${
                      item.status === 'finished'
                        ? 'text-green-700  '
                        : 'text-red-700'
                    } pb-2`}>
                    Aborted
                  </Text>
                  <Icons name="closecircleo" size={23} color="#ef4444" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
