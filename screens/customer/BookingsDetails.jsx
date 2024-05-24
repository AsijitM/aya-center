import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icons from 'react-native-vector-icons/Entypo';
import Icons2 from 'react-native-vector-icons/AntDesign';
import Icons3 from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const BookingDetailsScreen = ({route}) => {
  const {bookingId} = route.params; // Extract the booking ID from navigation params

  const user = auth().currentUser;
  console.log(user.providerData);

  const navigation = useNavigation();
  const [booking, setBooking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [workerList, setWorkerList] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(false);
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
          setUserData(userDoc.data().role);
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

  useEffect(() => {
    // Fetch worker list from Firebase
    const fetchWorkerList = async () => {
      const workerSnapshot = await firestore()
        .collection('users')
        .where('role', '==', 'worker')
        .get();

      const workers = workerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setWorkerList(workers);
    };

    fetchWorkerList();
  }, []);

  // const handleWorkerSelect = workerId => {
  //   setSelectedWorker(workerId);
  // };
  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const bookingDoc = await firestore()
          .collection('bookings')
          .doc(bookingId)
          .get();
        if (bookingDoc.exists) {
          setBooking(bookingDoc.data());
        } else {
          console.error('Booking not found');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleAssign = async () => {
    if (selectedWorker) {
      setLoading(true);
      try {
        // Update booking with worker ID and name
        await firestore()
          .collection('bookings')
          .doc(bookingId)
          .update({
            worker_id: selectedWorker,
            worker_name: workerList.find(worker => worker.id === selectedWorker)
              .name,
            worker: true,
            status: 'In Progress',
          });
        // Close modal and update booking variable
        setModalVisible(false);
        setBooking({
          ...booking,
          worker_id: selectedWorker,
          worker_name: workerList.find(worker => worker.id === selectedWorker)
            .name,
          worker: true,
        });
      } catch (error) {
        console.error('Error updating booking:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!booking) {
    return (
      <View style="flex-1">
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icons name="arrow-with-circle-left" size={24} />
      </TouchableOpacity>

      <Text className="text-3xl font-bold m-3 text-gray-700">
        Booking Details
      </Text>

      <ScrollView className="flex-1 p-2">
        <View className="bg-blue-100 rounded-lg p-3 mb-3 flex-row pb-4 mt-3">
          <Text className="text-base font-semibold text-black ">
            Time Duration:
          </Text>
          <Text className="ml-3 text-base font-medium text-gray-800">
            {booking.startTime} to {booking.endTime}
          </Text>
        </View>

        <View className="bg-blue-100 rounded-lg p-3 mb-3 flex-row pb-4 mt-3">
          <Text className="text-base font-semibold text-black ">Location:</Text>
          <Text className="ml-3 text-base font-medium text-gray-800">
            {booking.location}
          </Text>
        </View>
        <View className="bg-blue-100 rounded-lg p-3 mb-3 flex-row pb-4 mt-3">
          <Text className="text-base font-semibold text-black ">Address:</Text>
          <Text className="ml-3 text-base font-medium text-gray-800">
            {booking.address}
          </Text>
        </View>
        <View className="bg-blue-100 rounded-lg p-3 mb-3 flex-row flex-wrap pb-4 mt-3">
          <Text className="text-base font-semibold text-black ">
            Description:
          </Text>
          <Text className="ml-3 text-base font-medium text-gray-800">
            {booking.description}
          </Text>
        </View>

        <View className="bg-blue-100 rounded-lg p-3 mb-3 flex-row pb-4 mt-3">
          <Text className="text-base font-semibold text-black ">
            Worker Assigned:
          </Text>

          {booking.worker ? (
            <Text className="ml-3 text-base font-medium text-green-500">
              <Icons2 name="checkcircle" size={23} />
            </Text>
          ) : (
            <Text className="ml-3 text-base font-medium text-red-500">
              <Icons2 name="closecircle" size={23} />
            </Text>
          )}
        </View>

        <View className="bg-blue-100 rounded-lg p-3 mb-3 flex-row mt-3">
          <Text className="text-base font-semibold text-black ">
            Worker Name:
          </Text>
          {booking && booking.worker_name ? (
            <Text className="ml-3 text-base font-medium text-slate-800 ">
              {booking.worker_name}
            </Text>
          ) : (
            <Text className="ml-3 text-base font-medium text-red-600 ">
              Not assigned
            </Text>
          )}
          {userData === 'admin' && (
            <TouchableOpacity onPress={handlePress}>
              <Text className="ml-3 text-base font-medium text-slate-600 ">
                <Icons2 name="adduser" size={23} />
              </Text>
            </TouchableOpacity>
          )}
          <Modal
            visible={modalVisible}
            onRequestClose={handleCloseModal}
            transparent={true}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View className="bg-white p-6 rounded-lg w-80">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="absolute top-3 right-5">
                  <Icons3 name="x-circle" size={30} color="red" />
                </TouchableOpacity>
                <Text className="text-xl font-bold mb-4">Assign worker</Text>
                <ScrollView style={{maxHeight: 200}}>
                  {workerList.map(worker => (
                    <TouchableOpacity
                      key={worker.id}
                      onPress={() => {
                        // Handle worker selection here
                        setSelectedWorker(worker.id);
                      }}
                      className={`rounded-md py-2 px-3 mb-2 border-2 ${
                        selectedWorker === worker.id
                          ? 'bg-green-100 border-green-500'
                          : 'border-gray-300'
                      }`}>
                      <Text className="text-black font-bold text-center pr-2">
                        {worker.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  onPress={handleAssign}
                  className="bg-blue-500 rounded-md py-2  mt-4">
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <View className="flex-row  items-center justify-center">
                      <Text className="text-white text-base font-bold text-center pr-2">
                        Assign
                      </Text>
                      <Icons2 name="checkcircleo" size={17} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingDetailsScreen;
