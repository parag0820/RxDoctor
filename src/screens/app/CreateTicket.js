import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../../utils/api';

export default function CreateTicket({navigation}) {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [orderId, setOrderId] = useState('');
  const [dateOfOrder, setDateOfOrder] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [concernName, setConcernName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [issueType, setIssueType] = useState('');
  const [relatedList, setRelatedList] = useState([]);
  const [selectedRefId, setSelectedRefId] = useState('');
  const [priority, setPriority] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');

  // console.log('related List ', selectedCategoryId);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    // date is a JS Date object
    setDateOfOrder(date.toISOString());
    hideDatePicker();
  };

  const fetchTicketCategories = async () => {
    try {
      const res = await api.get('ticket-category/getall');

      setCategoryList(res.data?.data || []);
    } catch (error) {
      console.log('CATEGORY ERROR:', error.response?.data || error.message);
    }
  };

  const fetchSubCategories = async categoryId => {
    try {
      const response = await api.get(
        `ticket-subcategory/getall?categoryId=${categoryId}`,
      );

      setSubCategoryList(response?.data?.data || []);
    } catch (error) {
      console.log('SUB CATEGORY ERROR:', error.response?.data || error.message);
    }
  };

  // 🔹 Fetch data based on issue type
  const fetchRelatedData = async type => {
    try {
      const patientId = await AsyncStorage.getItem('userId');
      let response;

      switch (type) {
        case 'prescription':
        case 'doctor':
          response = await api.get(`/docpres/presByPatient/${patientId}`);
          break;

        case 'diagnostic':
          response = await api.get(
            `/diagnosticEarning/earning-viewByPatient/${patientId}`,
          );
          break;

        case 'pharma':
          response = await api.get(
            `/pharmaEarning/view-by-patient/${patientId}`,
          );
          break;

        case 'payment':
          response = await api.get(`payment/patient/${patientId}`);
          break;

        default:
          return;
      }
      // console.log('response?.data', response?.data);

      setRelatedList(
        response?.data?.data ||
          response?.data?.earning ||
          response?.data?.DocPres ||
          [],
      );
    } catch (error) {
      console.log('FETCH ERROR:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (issueType) {
      fetchRelatedData(issueType);
      setSelectedRefId('');
    }
  }, [issueType]);
  useEffect(() => {
    fetchTicketCategories();
  }, []);

  const selectedItem = relatedList.find(i => i._id === selectedRefId);

  // 🔹 Camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openCamera = async () => {
    if (!(await requestCameraPermission())) return;
    const result = await launchCamera({mediaType: 'photo', quality: 0.7});
    if (!result.didCancel && result.assets?.length) setImage(result.assets[0]);
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 0.7});
    if (!result.didCancel && result.assets?.length) setImage(result.assets[0]);
  };

  const chooseUploadOption = () => {
    Alert.alert('Upload File', 'Choose an option', [
      {text: 'Camera', onPress: openCamera},
      {text: 'Gallery', onPress: openGallery},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Ticket created',
      text2: 'Your ticket has been submitted successfully',
    });
    setTimeout(() => navigation.goBack(), 2000);
  };

  const onHandleTicketSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Validation', 'Subject and Description are required');
      return;
    }

    try {
      const doctorId = await AsyncStorage.getItem('userId');
      const formData = new FormData();

      formData.append('doctorId', doctorId);
      formData.append('ticketCategoryId', selectedCategoryId);
      formData.append('ticketSubCategoryId', selectedSubCategoryId);
      formData.append('orderId', orderId);
      formData.append('dateOfOrder', dateOfOrder);
      formData.append('ticketTitle', title);
      formData.append('concernName', concernName);
      formData.append('description', description);
      formData.append('priority', priority);
      formData.append('status', 'Open');
      // formData.append('dateOfOrder', new Date(dateOfOrder).toISOString());
      // formData.append('dateOfOrder', dateOfOrder);
      // formData.append('ticketCategory', 'payment Problem');
      // formData.append('ticketRelated', selectedRefId);
      // if (selectedRefId) formData.append('referenceId', selectedRefId);

      if (image?.uri) {
        formData.append('image', {
          uri:
            Platform.OS === 'android'
              ? image.uri
              : image.uri.replace('file://', ''),
          type: image.type || 'image/jpeg',
          name: image.fileName || `ticket_${Date.now()}.jpg`,
        });
      }

      await api.post('/doctor-ticket/ticket-create', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      showToast();
    } catch (error) {
      console.log('ERROR:', error.response?.data || error.message);
    }
  };
  const formatDate = isoDate => {
    const date = new Date(isoDate);

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  const last4Id = id => id?.slice(-4);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Issue Type */}
        {/* Ticket Category */}
        <Text style={styles.label}>Ticket Category</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategoryId}
            onValueChange={value => {
              setSelectedCategoryId(value);
              setSelectedSubCategoryId('');
              if (value) {
                fetchSubCategories(value);
              }
            }}
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
            size={26}
            color="#555"
            style={styles.arrowIcon}
          />
        </View>
        {subCategoryList.length > 0 && (
          <>
            <Text style={styles.label}>Ticket Sub Category</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSubCategoryId}
                onValueChange={setSelectedSubCategoryId}
                style={styles.picker}>
                <Picker.Item label="Select Sub Category" value="" />

                {subCategoryList.map(item => (
                  <Picker.Item
                    key={item._id}
                    label={`Id: ${last4Id(
                      item.AdminTicketCategoryId,
                    )}  |  Date${formatDate(item.createdAt)}`}
                    value={item.AdminTicketCategoryId}
                  />
                ))}
              </Picker>

              <MaterialIcons
                name="keyboard-arrow-down"
                size={26}
                color="#555"
                style={styles.arrowIcon}
              />
            </View>
          </>
        )}

        {/* Related Order */}
        {relatedList.length > 0 && (
          <>
            <Text style={styles.label}>Select Order / Appointment</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedRefId}
                onValueChange={setSelectedRefId}
                style={styles.picker}>
                <Picker.Item label="Select" value="" />

                {relatedList.map(item => {
                  const fullId = String(
                    item.orderId || item.appointmentId || item._id || '',
                  );

                  const shortId = fullId.slice(-4);

                  const displayDate =
                    item.date?.slice(0, 10) ||
                    item.dateOfPrescription?.slice(0, 10) ||
                    '';

                  const displayText =
                    item.centerName || item.doctorName || displayDate;

                  return (
                    <Picker.Item
                      key={item._id}
                      value={item._id}
                      label={`ID: ${shortId} | ${displayText} | Date:  ${
                        item.date?.slice(0, 10) ||
                        item?.dateOfPrescription?.slice(0, 10) ||
                        'N/A'
                      }`}
                    />
                  );
                })}
              </Picker>

              <MaterialIcons
                name="keyboard-arrow-down"
                size={26}
                color="#555"
                style={styles.arrowIcon}
              />
            </View>

            {selectedRefId && (
              <View style={styles.detailsBox}>
                {(() => {
                  const item = relatedList.find(i => i._id === selectedRefId);
                  if (!item) return null;

                  return (
                    <>
                      <Text style={styles.detailText}>
                        ID: {item.orderId || item.appointmentId || item._id}
                      </Text>
                      <Text style={styles.detailText}>
                        Name:{' '}
                        {item.centerName ||
                          item.doctorName ||
                          item.pharmaName ||
                          'N/A'}
                      </Text>
                      <Text style={styles.detailDate}>
                        Date:{' '}
                        {item.date?.slice(0, 10) ||
                          item?.dateOfPrescription?.slice(0, 10) ||
                          'N/A'}
                      </Text>
                    </>
                  );
                })()}
              </View>
            )}
          </>
        )}

        {/* Subject */}
        <Text style={styles.label}>Ticket Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter Title"
          placeholderTextColor="gray"
        />
        {/* Order Id */}
        <Text style={styles.label}>Order ID</Text>
        <TextInput
          style={styles.input}
          value={orderId}
          onChangeText={setOrderId}
          placeholder="Enter Order ID"
          placeholderTextColor="gray"
        />
        {/* Order Of Date */}
        <Text style={styles.label}>Order Date</Text>
        <TextInput
          style={styles.input}
          value={dateOfOrder}
          onChangeText={setDateOfOrder}
          placeholder="Enter Order Date"
          placeholderTextColor="gray"
        />
        {/* Concern Name */}
        <Text style={styles.label}>Concern Name</Text>
        <TextInput
          style={styles.input}
          value={concernName}
          onChangeText={setConcernName}
          placeholder="Enter Concern Name"
          placeholderTextColor="gray"
        />

        {/* Priority */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={priority}
            onValueChange={setPriority}
            style={styles.picker}>
            <Picker.Item label="Select Priority" value="" />
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>

          <MaterialIcons
            name="keyboard-arrow-down"
            size={26}
            color="#555"
            style={styles.arrowIcon}
          />
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Describe your issue"
          placeholderTextColor="gray"
        />

        {/* Upload */}
        <TouchableOpacity style={styles.uploadBtn} onPress={chooseUploadOption}>
          <Text style={styles.uploadText}>📎 Upload Image</Text>
        </TouchableOpacity>

        {image && <Image source={{uri: image.uri}} style={styles.preview} />}

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={onHandleTicketSubmit}>
          <Text style={styles.submitText}>Submit Ticket</Text>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 15,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 8,
    justifyContent: 'center',
  },

  picker: {
    color: '#000',
  },

  arrowIcon: {
    position: 'absolute',
    right: 10,
    pointerEvents: 'none',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    color: '#000',
  },

  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },

  uploadBtn: {
    marginTop: 15,
    padding: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
  },

  uploadText: {
    color: '#555',
    fontSize: 14,
  },

  preview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },

  submitBtn: {
    marginTop: 30,
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  detailsBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },

  detailText: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },

  detailDate: {
    color: '#666',
    fontSize: 12,
  },
});
