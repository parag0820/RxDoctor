import React, {useEffect, useState} from 'react';
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
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PrescribeTest({navigation}) {
  const [prescriptions, setPrescriptions] = useState([
    {
      Test: '',
      course: '',
      other: '',
      priority: '',
      prescription: '',
      medicine: null,
    },
  ]);

  const [showMedicineOptions, setShowMedicineOptions] = useState(false);
  const [showMedicineTime, setShowMedicineTime] = useState(false);
  const [showDosageAfterFood, setShowDosageAfterFood] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const route = useRoute();
  const {patientId, patientName} = route.params;

  // Helper function for date and time formatting
  const formatDate = date => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = date => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const medicineOptions = medicines;
  // console.log('haah', medicineOptions);

  const handleInputChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    // console.log(updatedPrescriptions);

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

  // get test List

  const getTest = async () => {
    try {
      const response = await api.get(`/test/view-test`);
      setMedicines(response.data.Test);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleMultiSelectOption = (index, field, option) => {
    console.log('Option', option);

    const selectedOptions = prescriptions[index][field] || [];
    const isSelected = selectedOptions.some(
      selected => selected.testName === option.testName,
    );

    // Toggle selection
    const updatedOptions = isSelected
      ? selectedOptions.filter(
          selected => selected.testName !== option.testName,
        )
      : [...selectedOptions, option];

    console.log('test', updatedOptions);
    handleInputChange(index, field, updatedOptions); // Update using handleInputChange
  };

  const prescriptionHandler = async () => {
    const doctorId = await AsyncStorage.getItem('userId');
    const postData = {
      pres: prescriptions.map(item => ({
        doctorId,
        patientId,
        labTest: item.medicine?.map(test => test.testName) || [],
        priority: item.prescription || '',
        course: item.course || '',
        other: item.other,
        date: formatDate(new Date()),
        time: formatTime(new Date()),
      })),

      //for api pera -- doctorId, patientId, course, labTest , priority, other
    };
    const data = postData.pres[0];

    try {
      const response = await api.post(`/testReport/add-testPrescription`, data);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTest();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {prescriptions.map((item, index) => (
          <View key={index} style={styles.additionalPrescription}>
            {/*  <Text style={globalStyles.inputHeading}>Lab test</Text>
            <TextInput
              placeholder="Test"
              style={styles.prescription}
              multiline={true}
              placeholderTextColor={colorGlobal.gray}
              value={item.prescription}
              onChangeText={text => handleInputChange(index, 'Test', text)}
            /> */}

            <Text style={globalStyles.inputHeading}>Course</Text>
            <TextInput
              placeholderTextColor={colorGlobal.gray}
              placeholder="course"
              style={styles.input}
              value={item.course}
              onChangeText={text => handleInputChange(index, 'course', text)}
            />

            {/* Medicine Dropdown */}
            <Text style={globalStyles.inputHeading}>Select Lab Test</Text>
            <View style={styles.customContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.header}
                onPress={() => toggleDropdown('medicine')}>
                <Text style={styles.selectedText}>
                  {item.medicine && item.medicine.length > 0
                    ? item.medicine
                        .map(selected => selected.testName)
                        .join(', ')
                    : 'Select Test'}
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
                    {medicineOptions.map(option => {
                      const isSelected = item.medicine?.some(
                        selected => selected.testName === option.testName,
                      );
                      return (
                        <TouchableOpacity
                          key={option._id}
                          style={[
                            styles.option,
                            isSelected && styles.selectedOption,
                          ]}
                          onPress={() =>
                            handleMultiSelectOption(index, 'medicine', option)
                          }>
                          <Text style={styles.optionText}>
                            {option.testName}
                          </Text>
                          {isSelected && (
                            <Icon name="check" size={16} color="#000" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </TouchableWithoutFeedback>
              )}
            </View>

            <Text style={globalStyles.inputHeading}>Diagnose</Text>
            <TextInput
              placeholderTextColor={colorGlobal.gray}
              placeholder="Diagnose"
              style={styles.input}
              multiline={true}
              value={item.prescription}
              onChangeText={text =>
                handleInputChange(index, 'prescription', text)
              }
            />
            <Text style={globalStyles.inputHeading}>Other</Text>
            <TextInput
              placeholderTextColor={colorGlobal.gray}
              placeholder="Add Something here..."
              style={styles.input}
              multiline={true}
              value={item.other}
              onChangeText={text => handleInputChange(index, 'other', text)}
            />
            <TouchableOpacity
              style={styles.buttonView}
              onPress={prescriptionHandler}>
              <Text style={styles.buttonText}>Save Prescription</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
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
    color: colorGlobal.gray,
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

  additionalPrescription: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  buttonView: {
    backgroundColor: colorGlobal.themeColor,
    paddingVertical: 10,
    marginTop: 20,
    width: '100%',
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
