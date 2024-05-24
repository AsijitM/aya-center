import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import 'nativewind';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const BookingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {userId} = route.params;

  const currentTime = new Date();
  const initialStartTime = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
  const initialEndTime = new Date(
    initialStartTime.getTime() + 4 * 60 * 60 * 1000,
  );

  const [date, setDate] = useState(new Date());
  const [endTime, setEndTime] = useState(initialEndTime);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const sendNotification = () => {
    fetch('https://us-central1-aya-center.cloudfunctions.net/api/send-noti', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // You can send an empty body or any other required data
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      if (selectedTime < initialStartTime) {
        Alert.alert(
          'Alert',
          'Booking needs to be made at least  2 Hours before',
        );
        return;
      }
      setStartTime(selectedTime);
      const newEndTime = new Date(selectedTime);
      newEndTime.setHours(newEndTime.getHours() + 4);
      setEndTime(newEndTime);
    }
  };
  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const timeDifference = (selectedTime - startTime) / (1000 * 60 * 60); // Difference in hours
      if (timeDifference >= 4) {
        setEndTime(selectedTime);
      } else {
        Alert.alert(
          'Alert',
          'End time must be at least 4 hours after start time.',
        );
      }
    }
  };

  const handleBooking = async () => {
    setIsLoading(true);
    // Validate data before adding to Firestore (optional but recommended)
    if (!date || !startTime || !endTime || !address || !location) {
      Alert.alert('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    // Format date and time for Firestore (consider time zones if needed)
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedStartTime = startTime.toTimeString().slice(0, 5); // HH:MM (consider using moment.js or similar for more control)
    const formattedEndTime = endTime.toTimeString().slice(0, 5); // HH:MM (consider using moment.js or similar for more control)

    const bookingData = {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      address,
      location,
      description,
      customer_id: userId,
      status: 'queue',
      worker: false,
    };

    try {
      await firestore().collection('bookings').add(bookingData);
      setBooked(true);
      sendNotification();
    } catch (error) {
      console.error('Error adding booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBooked(false);
    setIsLoading(false);
    setAddress('');
    setLocation('');
    setDescription('');
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-3xl font-bold mb-4 text-gray-700">Book a Slot</Text>
      <Text className="text-lg mb-2">
        Select Date <Text className="text-red-600">*</Text>:
      </Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="border border-gray-400 p-2 mb-4 rounded">
        <Text className="text-gray-700">{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      <Text className="text-lg mb-2">
        Select Start Time <Text className="text-red-600">*</Text>:
      </Text>
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        className="border border-gray-400 p-2 mb-4 rounded">
        <Text className="text-gray-700">
          {startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Text className="text-lg mb-2">
        Select End Time <Text className="text-red-600">*</Text>:
      </Text>
      <TouchableOpacity
        onPress={() => setShowEndTimePicker(true)}
        className="border border-gray-400 p-2 mb-4 rounded">
        <Text className="text-gray-700">
          {endTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
        </Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
      <Text className="text-lg mb-2">
        Address <Text className="text-red-600">*</Text>:
      </Text>
      <TextInput
        className="border border-gray-400 p-2 mb-4 rounded"
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
      />
      <Text className="text-lg mb-2">
        Location <Text className="text-red-600">*</Text>:
      </Text>
      <TextInput
        className="border border-gray-400 p-2 mb-4 rounded"
        placeholder="Enter location"
        value={location}
        onChangeText={setLocation}
      />
      <Text className="text-lg mb-2">
        Description <Text className="text-red-600">*</Text>:
      </Text>
      <TextInput
        className="border border-gray-400 p-2 mb-3 rounded"
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        className={`${
          booked ? 'bg-green-500' : 'bg-blue-500'
        } rounded-full h-12 items-center justify-center mt-4`}
        disabled={isLoading || booked} // Disable button while loading
        onPress={handleBooking}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : booked ? (
          <View className="flex-row justify-center items-center">
            <Icon name="calendar-check" size={20} solid color="white" />
            <Text className="text-white text-center text-lg ml-2">Booked</Text>
          </View>
        ) : (
          <View className="flex-row justify-center items-center">
            <Icon name="calendar" size={20} solid color="white" />
            <Text className="text-white text-center text-lg ml-2">
              Book the slot
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <View className="flex-row  mt-4 justify-evenly">
        <TouchableOpacity
          onPress={handleReset}
          className="flex-row items-center">
          <Icon name="undo" size={20} color="#3b82f6" />
          <Text className="text-blue-500 ml-3">Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            navigation.navigate('Booking');
          }}>
          <Icon name="home" size={20} color="#3b82f6" />
          <Text className="text-blue-500 ml-3">Back to Home </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingScreen;
