// make this responsive to render bottom button also visible //  add medicine api post  /medicine/add
// get all  /medicine/fetchall

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyles, {colorGlobal} from '../../utils/globalStyls';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';

const medicineOptions = [
  {label: 'Paracetamol', value: 'paracetamol'},
  {label: 'Ibuprofen', value: 'ibuprofen'},
  // Add more options here
];

const medicineTimeOptions = [
  {label: 'Morning', value: 'morning'},
  {label: 'Afternoon', value: 'afternoon'},
  {label: 'Evening', value: 'evening'},
];

const dosageAfterFoodOptions = [
  {label: 'Before Meal', value: 'beforeMeal'},
  {label: 'After Meal', value: 'afterMeal'},
];

export default function PatientPrescription({navigation}) {
  const [prescriptions, setPrescriptions] = useState([
    {
      prescription: '',
      dosage: '',
      course: '',
      medicine: null,
      medicineTime: [],
      dosageAfterFood: null,
    },
  ]);

  const [showMedicineOptions, setShowMedicineOptions] = useState(false);
  const [showMedicineTime, setShowMedicineTime] = useState(false);
  const [showDosageAfterFood, setShowDosageAfterFood] = useState(false);
  const [other, setOther] = useState('');
  const [addMedicine, setAddMedicine] = useState('');
  const [isShow, setIsShow] = useState(false);
  const route = useRoute();
  const {patientId, patientName} = route.params;

  const handleInputChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleMultiSelectChange = (index, value) => {
    const updatedPrescriptions = [...prescriptions];
    const selectedTimes = updatedPrescriptions[index].medicineTime;

    // Check if the value is already selected, if so, remove it, otherwise add it
    if (selectedTimes.includes(value)) {
      updatedPrescriptions[index].medicineTime = selectedTimes.filter(
        item => item !== value,
      );
    } else {
      updatedPrescriptions[index].medicineTime = [...selectedTimes, value];
    }

    setPrescriptions(updatedPrescriptions);
  };

  const toggleDropdown = dropdown => {
    if (dropdown === 'medicine') {
      setShowMedicineOptions(!showMedicineOptions);
    } else if (dropdown === 'medicineTime') {
      setShowMedicineTime(!showMedicineTime);
    } else if (dropdown === 'dosageAfterFood') {
      setShowDosageAfterFood(!showDosageAfterFood);
    }
  };

  const addMorePrescriptions = () => {
    setPrescriptions([
      ...prescriptions,
      {
        prescription: '',
        dosage: '',
        course: '',
        medicine: null,
        medicineTime: [],
        dosageAfterFood: null,
      },
    ]);
  };

  const prescriptionHandler = async () => {
    try {
      const userId = await AsyncStorage.getItem(`userId`);
      const doctorName = await AsyncStorage.getItem(`userName`);
      console.log('user', doctorName);

      // Get the current date and time
      const now = new Date();

      // Format the date as DD:MM:YYYY
      const currentDate = now.toLocaleDateString('en-GB').replace(/\//g, '/');

      // Format the time as HH:MM AM/PM
      const currentTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });

      const postData = {
        prescDoctor: prescriptions.map(item => ({
          medicine: item.medicine?.value || '',
          prescription: item.prescription || '',
          dosage: item.dosage || '',
          course: item.course || '',
          isDosageAfterFood: item.dosageAfterFood?.value || '',
          medicineTime: item.medicineTime.join(',') || '',
          addMedicine: addMedicine || '',
          date: currentDate,
          time: currentTime,
        })),
        other: other || '', // Ensure you have `otherDetails` in your state or collect it as needed
        addMedicine: addMedicine || '',
        patientName: patientName || '', // Ensure patientName is part of your state
        doctorName: doctorName || '', // Ensure doctorName is part of your state
        doctorId: userId || '', // Ensure doctorId is part of your state
        PatientId: patientId || '', // Ensure patientId is part of your state
      };

      console.log('Sending the following data to the API:', postData);

      // Make API call with Axios
      const response = await api.post('/presFrom/add-pres', postData);
      console.log('response api pres', response);

      if (response.status === 200) {
        // Handle success response
        console.log('Prescription saved successfully:', response.data);
        alert('Prescription saved successfully!');
        navigation.navigate('Home');
      } else {
        // Handle error based on the response status
        console.error('Error saving prescription:', response.status);
        alert('Failed to save prescription.');
      }
    } catch (error) {
      // Handle network errors or other Axios-related errors
      console.error('Error while making the API call:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {prescriptions.map((item, index) => (
          <View key={index} style={styles.additionalPrescription}>
            <Text style={globalStyles.inputHeading}>Prescription</Text>
            <TextInput
              placeholder="Prescription"
              style={styles.prescription}
              multiline={true}
              placeholderTextColor={colorGlobal.gray}
              value={item.prescription}
              onChangeText={text =>
                handleInputChange(index, 'prescription', text)
              }
            />

            <Text style={globalStyles.inputHeading}>Dosage</Text>
            <TextInput
              placeholder="Dosage"
              placeholderTextColor={colorGlobal.gray}
              style={styles.input}
              value={item.dosage}
              onChangeText={text => handleInputChange(index, 'dosage', text)}
            />

            <Text style={globalStyles.inputHeading}>Course</Text>
            <TextInput
              placeholderTextColor={colorGlobal.gray}
              placeholder="course"
              style={styles.input}
              value={item.course}
              onChangeText={text => handleInputChange(index, 'course', text)}
            />

            {/* Medicine Dropdown */}
            <Text style={globalStyles.inputHeading}>Select Medicine</Text>
            <View style={styles.customContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.header}
                onPress={() => toggleDropdown('medicine')}>
                <Text style={styles.selectedText}>
                  {item.medicine ? item.medicine.label : 'Select Medicine'}
                </Text>
                <Icon
                  name={showMedicineOptions ? 'angle-up' : 'angle-down'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
              {showMedicineOptions && (
                <TouchableWithoutFeedback>
                  <ScrollView
                    style={styles.optionsContainer}
                    nestedScrollEnabled>
                    {medicineOptions.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.option,
                          item.medicine === option && styles.selectedOption,
                        ]}
                        onPress={() => {
                          handleInputChange(index, 'medicine', option);
                          setShowMedicineOptions(false); // Close dropdown after selection
                        }}>
                        <Text style={styles.optionText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </TouchableWithoutFeedback>
              )}
            </View>

            {/* Medicine Time - Multi-select Dropdown */}
            <Text style={globalStyles.inputHeading}>Medicine Time</Text>
            <View style={styles.customContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.header}
                onPress={() => toggleDropdown('medicineTime')}>
                <Text style={styles.selectedText}>
                  {item.medicineTime.length > 0
                    ? item.medicineTime.join(', ')
                    : 'Morning / Afternoon / Evening'}
                </Text>
                <Icon
                  name={showMedicineTime ? 'angle-up' : 'angle-down'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
              {showMedicineTime && (
                <TouchableWithoutFeedback>
                  <ScrollView
                    style={styles.optionsContainer}
                    nestedScrollEnabled>
                    {medicineTimeOptions.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.option,
                          item.medicineTime.includes(option.value) &&
                            styles.selectedOption,
                        ]}
                        onPress={() =>
                          handleMultiSelectChange(index, option.value)
                        }>
                        <Text style={styles.optionText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </TouchableWithoutFeedback>
              )}
            </View>

            {/* Dosage After Meal */}
            <Text style={globalStyles.inputHeading}>Dosage After Food</Text>
            <View style={styles.customContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.header}
                onPress={() => toggleDropdown('dosageAfterFood')}>
                <Text style={styles.selectedText}>
                  {item.dosageAfterFood
                    ? item.dosageAfterFood.label
                    : 'Before Meal / After Meal'}
                </Text>
                <Icon
                  name={showDosageAfterFood ? 'angle-up' : 'angle-down'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
              {showDosageAfterFood && (
                <TouchableWithoutFeedback>
                  <ScrollView
                    style={styles.optionsContainer}
                    nestedScrollEnabled>
                    {dosageAfterFoodOptions.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.option,
                          item.dosageAfterFood === option &&
                            styles.selectedOption,
                        ]}
                        onPress={() => {
                          handleInputChange(index, 'dosageAfterFood', option);
                          setShowDosageAfterFood(false); // Close dropdown after selection
                        }}>
                        <Text style={styles.optionText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <ScrollView style={{height: '40%', marginBottom: 10}}>
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={addMorePrescriptions}>
          <Text style={styles.addMoreText}>Add More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={() => {
            setIsShow(!isShow);
          }}>
          <Text style={styles.addMoreText}>
            {isShow ? ' hide add new medicine' : 'show add new medicine'}
          </Text>
        </TouchableOpacity>
        {isShow ? (
          <View>
            <Text style={[globalStyles.inputHeading, {marginHorizontal: 20}]}>
              Add New Medicine
            </Text>
            <TextInput
              style={[styles.prescription, {marginHorizontal: 20}]}
              placeholder="Add Medicine"
              onChangeText={text => {
                setAddMedicine(text);
              }}
              value={addMedicine}
            />
          </View>
        ) : null}

        <Text style={[globalStyles.inputHeading, {marginHorizontal: 20}]}>
          Other Details
        </Text>
        <TextInput
          style={[styles.prescription, {marginHorizontal: 20}]}
          placeholder="B.P. , body temp"
          placeholderTextColor={colorGlobal.gray}
          onChangeText={text => {
            setOther(text);
          }}
          value={other}
        />

        <TouchableOpacity
          style={styles.buttonView}
          onPress={prescriptionHandler}>
          <Text style={styles.buttonText}>Save Prescription</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingBottom: 10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: colorGlobal.black,
  },
  prescription: {
    borderWidth: 1,
    borderColor: colorGlobal.gray,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: colorGlobal.black,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colorGlobal.gray,
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: colorGlobal.black,
  },
  customContainer: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: colorGlobal.gray,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  selectedText: {
    fontSize: 16,
    color: colorGlobal.black,
  },
  optionsContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: colorGlobal.gray,
    borderRadius: 5,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  option: {
    padding: 12,
  },
  selectedOption: {
    backgroundColor: colorGlobal.seaGreen,
    marginVertical: 2,
  },
  optionText: {
    fontSize: 16,
    color: colorGlobal.black,
  },
  addMoreButton: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addMoreText: {
    color: colorGlobal.themeColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalPrescription: {
    borderWidth: 1,
    borderColor: colorGlobal.gray,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  buttonView: {
    backgroundColor: colorGlobal.themeColor,
    marginBottom: 5,
    paddingVertical: 10,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colorGlobal.white,
  },
});
