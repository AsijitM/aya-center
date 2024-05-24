import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {styled} from 'nativewind';
import Icons from 'react-native-vector-icons/Feather';
import {useFocusEffect} from '@react-navigation/native';

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [phone, setPhone] = useState('');

  const fetchWorkers = async () => {
    try {
      const adminSnapshot = await firestore()
        .collection('users')
        .where('role', '==', 'worker')
        .get();

      const workerData = adminSnapshot.docs.map(doc => doc.data());
      setWorkers(workerData);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  // Function to handle deletion of admin
  const handleDeleteWorker = workerId => {
    // Implement your logic to delete the admin
  };

  // Function to handle deactivation of admin
  const handleDeactivateWorker = workerId => {
    // Implement your logic to deactivate the admin
  };

  const handleAddWorker = () => {
    setModalVisible(true);
    // Implement your logic to open modal for adding new admin
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkers();
    }, []),
  );

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-3xl font-bold m-3 text-gray-700">Workers</Text>
      <ScrollView className="flex-1 p-2">
        {workers.map((item, index) => (
          <View
            key={index}
            className="p-4 border-black border-2 flex-row items-center rounded-lg bg-gray-100 shadow-md mt-3">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-slate-800">Name</Text>
              <Text className="text-slate-600">email</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteWorker(item.id)}
              className="pr-5">
              <Icons name="trash" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeactivateWorker(item.id)}
              className="pr-4">
              <Icons name="slash" size={24} color="orange" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-8 right-8 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
        onPress={handleAddWorker}>
        <Icons name="plus" size={32} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          {/* Add your modal content here */}
          <View className="bg-white p-6 rounded-lg w-80">
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-3 right-5">
              <Icons name="x-circle" size={30} color="red" />
            </TouchableOpacity>
            <Text className="text-xl font-bold mb-4">Invite New Worker</Text>
            <TextInput
              placeholder="Phone Number"
              className="border-2  border-gray-600 rounded-md p-3 mb-10 bord"
              value={phone}
              onChangeText={value => setPhone(value)}
            />
            <TouchableOpacity
              onPress={() => {}}
              className="bg-blue-500 rounded-md py-2 flex-row items-center justify-center">
              <Text className="text-white font-bold text-center pr-2">
                Invite
              </Text>
              <Icons name="send" size={15} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
