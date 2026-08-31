import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import {colorGlobal} from '../../utils/globalStyls';
import {Picker} from '@react-native-picker/picker';

export default function CreateTicketModal({
  visible,
  onClose,
  orderId,
  orderIdarra,
}) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [ticketTitle, setTicketTitle] = useState('');
  const [description, setDescription] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [loading, setLoading] = useState(false);
  console.log('orderId Report', orderId);
  console.log('orderIdarra Report', orderIdarra);

  useEffect(() => {
    if (visible) {
      getDoctorId();
      fetchTicketCategories();
    }
  }, [visible]);

  const getDoctorId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setDoctorId(id);
  };

  const fetchTicketCategories = async () => {
    try {
      const res = await api.get('ticket-category/getall');
      setCategoryList(res.data?.data || []);
    } catch (error) {
      console.log('CATEGORY ERROR:', error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setSelectedCategoryId('');
    setTicketTitle('');
    setDescription('');
  };

  const createTicket = async () => {
    if (!selectedCategoryId) {
      Alert.alert('Validation', 'Please select category');
      return;
    }
    if (!ticketTitle.trim() || !description.trim()) {
      Alert.alert('Validation', 'Title and Description are required');
      return;
    }
    try {
      setLoading(true);
      const doctorId = await AsyncStorage.getItem('userId');
      const formData = new FormData();
      formData.append('doctorId', doctorId);
      formData.append('ticketCategoryId', selectedCategoryId);
      formData.append('ticketTitle', ticketTitle.trim());
      formData.append('description', description.trim());
      if (Array.isArray(orderIdarra)) {
        orderIdarra.forEach(id => {
          formData.append('orderIdArray', id);
        });
      }
      await api.post('/doctor-ticket/ticket-create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Alert.alert('Success', 'Ticket Created Successfully');
      resetForm();
      handleClose();
    } catch (error) {
      console.log('CREATE ERROR:', error.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    Toast.show({
      type: 'success',
      text1: 'Ticket Created',
      text2: 'Your ticket has been submitted successfully',
    });

    setTimeout(onClose, 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Create Ticket</Text>

          {/* Category Dropdown */}
          <Text style={styles.label}>Ticket Category</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategoryId}
              onValueChange={value => setSelectedCategoryId(value)}
              style={styles.picker}>
              <Picker.Item label="Select Category" value="" />
              {categoryList.map(item => (
                <Picker.Item
                  key={item._id}
                  label={item.ticketCategory}
                  value={item._id}
                />
              ))}
            </Picker>

            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color="#555"
              style={styles.arrowIcon}
            />
          </View>

          {/* Ticket Title */}
          <TextInput
            placeholder="Ticket Title"
            placeholderTextColor="gray"
            value={ticketTitle}
            onChangeText={setTicketTitle}
            style={styles.input}
          />

          {/* Description */}
          <TextInput
            placeholder="Description"
            placeholderTextColor="gray"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, {height: 90}]}
            multiline
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={createTicket}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{color: '#fff'}}>Submit</Text>
            )}
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            onPress={() => {
              resetForm();
              setLoading(false);
              onClose();
            }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  arrowIcon: {
    position: 'absolute',
    right: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    color: '#000',
  },
  button: {
    backgroundColor: colorGlobal.themeColor,
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 15,
  },
  cancelText: {
    marginTop: 15,
    textAlign: 'center',
    color: 'red',
  },
});
