import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {colorGlobal} from '../../utils/globalStyls';
import PrimaryButton from '../../components/PrimaryButton';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const morningTimeSlots = [
  '6 AM - 7 AM',
  '7 AM - 8 AM',
  '8 AM - 9 AM',
  '9 AM - 10 AM',
  '10 AM - 11 AM',
  '11 AM - 12 PM',
];
const eveningTimeSlots = [
  '1 PM - 2 PM',
  '2 PM - 3 PM',
  '3 PM - 4 PM',
  '4 PM - 5 PM',
  '5 PM - 6 PM',
  '6 PM - 7 PM',
  '7 PM - 8 PM',
  '8 PM - 9 PM',
];

const showToastPic = () => {
  Toast.show({
    type: 'success',
    text1: 'Your Details are Updated!👍',
  });
};

const availableDateTimeHandler = async doctorAvailableTime => {
  const userId = await AsyncStorage.getItem('userId');
  const body = {doctorAvailableTime};

  try {
    const response = await api.put(`/doctorPanel/doctor-edit/${userId}`, body);
    showToastPic();
  } catch (error) {
    console.log('Error:', error);
  }
};

const CustomDatePicker = ({
  text = 'Note This will show to the patient',
  color = 'black',
}) => {
  const scrollViewRef = useRef(null);

  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
  const [inputs, setInputs] = useState(['']);
  const [availableChecks, setAvailableChecks] = useState({});
  const [unavailableChecks, setUnavailableChecks] = useState({});

  const handleDaySelection = day => {
    setSelectedDays(prev => {
      const newSelectedDays = prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day];

      setSelectedTimeSlots(prevSlots => {
        const newSlots = {...prevSlots};
        if (!newSelectedDays.includes(day)) {
          delete newSlots[day];
        }

        if (!newSlots[day] || newSlots[day].length === 0) {
          setAvailableChecks(prev => {
            const newAvailableChecks = {...prev};
            Object.keys(newAvailableChecks).forEach(key => {
              if (key.startsWith(day)) {
                newAvailableChecks[key] = false;
              }
            });
            return newAvailableChecks;
          });

          setUnavailableChecks(prev => {
            const newUnavailableChecks = {...prev};
            Object.keys(newUnavailableChecks).forEach(key => {
              if (key.startsWith(day)) {
                newUnavailableChecks[key] = false;
              }
            });
            return newUnavailableChecks;
          });
        }

        return newSlots;
      });

      return newSelectedDays;
    });
  };

  const handleTimeSlotSelection = (day, timeSlot) => {
    setSelectedTimeSlots(prev => {
      const newSlots = {
        ...prev,
        [day]: prev[day]?.includes(timeSlot)
          ? prev[day].filter(t => t !== timeSlot)
          : [...(prev[day] || []), timeSlot],
      };

      if (newSlots[day]?.length > 0) {
        setAvailableChecks(prev => {
          const newAvailableChecks = {...prev};
          ['Chat', 'Audio Call', 'Video Call', 'In-person Visit'].forEach(
            option => {
              newAvailableChecks[`${day}_${option}`] = true;
            },
          );
          return newAvailableChecks;
        });

        setUnavailableChecks(prev => {
          const newUnavailableChecks = {...prev};
          ['Chat', 'Audio Call', 'Video Call', 'In-person Visit'].forEach(
            option => {
              newUnavailableChecks[`${day}_${option}`] = false;
            },
          );
          return newUnavailableChecks;
        });
      } else {
        setAvailableChecks(prev => {
          const newAvailableChecks = {...prev};
          Object.keys(newAvailableChecks).forEach(key => {
            if (key.startsWith(day)) {
              newAvailableChecks[key] = false;
            }
          });
          return newAvailableChecks;
        });

        setUnavailableChecks(prev => {
          const newUnavailableChecks = {...prev};
          Object.keys(newUnavailableChecks).forEach(key => {
            if (key.startsWith(day)) {
              newUnavailableChecks[key] = false;
            }
          });
          return newUnavailableChecks;
        });
      }

      return newSlots;
    });
  };

  const handleInputChange = (text, index) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);
  };

  const handleAddMore = () => {
    setInputs([...inputs, '']);
  };

  const handleCheckboxChange = (type, day, option) => {
    if (type === 'available') {
      setAvailableChecks(prev => {
        const newAvailableChecks = {
          ...prev,
          [`${day}_${option}`]: !prev[`${day}_${option}`],
        };

        if (newAvailableChecks[`${day}_${option}`]) {
          setUnavailableChecks(prevUnavailable => ({
            ...prevUnavailable,
            [`${day}_${option}`]: false,
          }));
        }

        return newAvailableChecks;
      });
    } else if (type === 'unavailable') {
      setUnavailableChecks(prev => {
        const newUnavailableChecks = {
          ...prev,
          [`${day}_${option}`]: !prev[`${day}_${option}`],
        };

        if (newUnavailableChecks[`${day}_${option}`]) {
          setAvailableChecks(prevAvailable => ({
            ...prevAvailable,
            [`${day}_${option}`]: false,
          }));
        }

        return newUnavailableChecks;
      });
    }
  };

  const getFormattedData = () => {
    const result = {};

    selectedDays.forEach(day => {
      const morningSlots = morningTimeSlots.filter(slot =>
        selectedTimeSlots[day]?.includes(slot),
      );
      const eveningSlots = eveningTimeSlots.filter(slot =>
        selectedTimeSlots[day]?.includes(slot),
      );
      result[day] = {slots: [...morningSlots, ...eveningSlots]};

      result[day].available = Object.keys(availableChecks)
        .filter(key => key.startsWith(day) && availableChecks[key])
        .map(key => key.split('_')[1]);

      result[day].unavailable = Object.keys(unavailableChecks)
        .filter(key => key.startsWith(day) && unavailableChecks[key])
        .map(key => key.split('_')[1]);

      result[day].dateInputs = inputs;
    });

    console.log('This Is My Result:', result);

    const dataToSend = Object.keys(result).reduce((acc, day) => {
      const {slots, available, unavailable} = result[day];
      acc[day] = {slots, available, unavailable};
      return acc;
    }, {});

    availableDateTimeHandler(dataToSend);
    return result;
  };

  const handleSubmit = () => {
    getFormattedData();
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, animated: true});
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}>
      <Text style={styles.title}>Select Available Time Slots</Text>
      {days.map(day => (
        <View key={day} style={styles.dayContainer}>
          <CheckBox
            checkedColor={colorGlobal.themeColor}
            title={day}
            checked={selectedDays.includes(day)}
            onPress={() => handleDaySelection(day)}
          />
          {selectedDays.includes(day) && (
            <View style={styles.timeContainer}>
              <Text style={styles.periodTitle}>Morning</Text>
              <View style={styles.timeSlotContainer}>
                {morningTimeSlots.map(timeSlot => (
                  <TouchableOpacity
                    key={timeSlot}
                    style={[
                      styles.timeSlot,
                      selectedTimeSlots[day]?.includes(timeSlot) &&
                        styles.selectedTimeSlot,
                    ]}
                    onPress={() => handleTimeSlotSelection(day, timeSlot)}>
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTimeSlots[day]?.includes(timeSlot) &&
                          styles.selectedTimeSlotText,
                      ]}>
                      {timeSlot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.periodTitle}>Evening</Text>
              <View style={styles.timeSlotContainer}>
                {eveningTimeSlots.map(timeSlot => (
                  <TouchableOpacity
                    key={timeSlot}
                    style={[
                      styles.timeSlot,
                      selectedTimeSlots[day]?.includes(timeSlot) &&
                        styles.selectedTimeSlot,
                    ]}
                    onPress={() => handleTimeSlotSelection(day, timeSlot)}>
                    <Text
                      style={[
                        styles.timeSlotText,
                        selectedTimeSlots[day]?.includes(timeSlot) &&
                          styles.selectedTimeSlotText,
                      ]}>
                      {timeSlot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Add TextInput under the day */}
              <View style={styles.inputContainer}>
                {inputs.map((input, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    value={input}
                    onChangeText={text => handleInputChange(text, index)}
                    placeholder={`Enter date ${index + 1}`}
                  />
                ))}
                <TouchableOpacity onPress={handleAddMore}>
                  <Text style={styles.addMore}>Add More</Text>
                </TouchableOpacity>

                {/* Available Dropdown */}
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownTitle}>Available</Text>
                  {['Chat', 'Audio Call', 'Video Call', 'In-person Visit'].map(
                    option => (
                      <CheckBox
                        key={option}
                        title={option}
                        checked={availableChecks[`${day}_${option}`] || false}
                        onPress={() =>
                          handleCheckboxChange('available', day, option)
                        }
                      />
                    ),
                  )}
                </View>

                {/* Unavailable Dropdown */}
                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownTitle}>Unavailable</Text>
                  {['Chat', 'Audio Call', 'Video Call', 'In-person Visit'].map(
                    option => (
                      <CheckBox
                        key={option}
                        title={option}
                        checked={unavailableChecks[`${day}_${option}`] || false}
                        onPress={() =>
                          handleCheckboxChange('unavailable', day, option)
                        }
                      />
                    ),
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      ))}
      <Text style={{color}}>{text}</Text>
      <PrimaryButton
        label="Submit"
        color={colorGlobal.themeColor}
        onPress={handleSubmit}
      />
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dayContainer: {
    marginBottom: 16,
  },
  timeContainer: {
    marginTop: 8,
    paddingLeft: 32,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    margin: 4,
    backgroundColor: '#fff',
  },
  selectedTimeSlot: {
    backgroundColor: colorGlobal.themeColor,
  },
  timeSlotText: {
    color: '#000',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  inputContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  addMore: {
    color: colorGlobal.themeColor,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
  },
  dropdownContainer: {
    marginTop: 16,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default CustomDatePicker;
