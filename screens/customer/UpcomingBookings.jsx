import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icons from 'react-native-vector-icons/Feather';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function UpcomingBookings({route}) {
  const {userRole} = route.params;
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);

  const handlePress = async () => {
    const user = auth().currentUser;
    try {
      if (user) {
        navigation.navigate('newBooking', {userId: user.uid});
      } else {
        // Handle case where there is no authenticated user
        console.log('No user is signed in.');
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const user = auth().currentUser;
      const todayDate = new Date();
      const todayDateString = todayDate.toISOString().split('T')[0];
      const bookingsCollection = firestore().collection('bookings'); //
      const querySnapshot = await bookingsCollection
        .where('date', '>=', todayDateString)
        .where('customer_id', '==', user.uid)
        .get(); // Fetch all documents

      const fetchedBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(), // Spread the document data for each booking
      }));

      setBookings(fetchedBookings); // Update the bookings state with fetched data
    } catch (error) {
      console.error('Error fetching bookings:', error); // Log the error for debugging
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
  function handleBookingDetails(id) {
    navigation.navigate('BookingDetails', {bookingId: id});
  }

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-3xl font-bold m-3 text-gray-700">
        Upcoming Bookings
      </Text>
      <ScrollView className="flex-1 p-2">
        {bookings.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            className={`p-3 border-2 ${
              item.status === 'queue'
                ? 'border-purple-500'
                : 'border-orange-500'
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
                <Icons name="chevron-right" size={20} color="black" />
              </View>
              {/* <Text className="text-gray-600">
                {item.startTime} - {item.endTime}
              </Text> */}

              <Text
                className={`font-medium ${
                  item.status === 'queue'
                    ? 'text-purple-500'
                    : 'text-orange-500'
                } pb-2`}>
                {item.status == 'queue' ? 'In Queue' : 'In Progress'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-8 right-8 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
        onPress={handlePress}>
        <Icons name="calendar" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
