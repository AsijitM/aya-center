import React, {useState, useEffect} from 'react';
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

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const adminSnapshot = await firestore()
          .collection('users')
          .where('role', '==', 'admin')
          .get();

        const adminData = adminSnapshot.docs.map(doc => doc.data());
        setAdmins(adminData);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  // Function to handle deletion of admin
  const handleDeleteAdmin = adminId => {
    // Implement your logic to delete the admin
  };

  // Function to handle deactivation of admin
  const handleDeactivateAdmin = adminId => {
    // Implement your logic to deactivate the admin
  };

  const handleAddAdmin = () => {
    setModalVisible(true);
    // Implement your logic to open modal for adding new admin
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {admins.map((item, index) => (
          <View
            key={index}
            className="p-4 border-b border-gray-300 flex-row items-center rounded-lg bg-gray-200 shadow-md mt-3">
            <View className="flex-1">
              <Text className="text-lg font-semibold">Name</Text>
              <Text className="text-gray-600">{item.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteAdmin(item.id)}
              className="pr-5">
              <Icons name="trash" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeactivateAdmin(item.id)}
              className="pr-4">
              <Icons name="slash" size={24} color="orange" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-8 right-8 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
        onPress={handleAddAdmin}>
        <Icons name="calendar" size={32} color="white" />
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
            <Text className="text-xl font-bold mb-4">Invite New Admin</Text>
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
