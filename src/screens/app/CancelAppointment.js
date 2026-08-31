import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import {CheckBox, Button} from 'react-native-elements';
import {colorGlobal} from '../../utils/globalStyls';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';

const reasons = [
  'I want to change to another doctor',
  'I want to change package',
  "I don't want to consult",
  'I have recovered from the disease',
  'I have found a suitable medicine',
  'I just want to cancel',
  "I don't want to tell",
  'Others',
];

const CancelAppointment = ({initialReason = '', onCancel = () => {}}) => {
  const [selectedReason, setSelectedReason] = useState(initialReason);
  const [otherReason, setOtherReason] = useState('');
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>Reason for Cancel Appointment</Text>

      {reasons.map((reason, index) => (
        <View
          key={index}
          style={{
            borderRadius: 8,
            paddingVertical: scale(8),
            borderWidth: 1,
            borderColor: colorGlobal.gray,
            marginVertical: scale(5),
          }}>
          <CheckBox
            title={reason}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={selectedReason === reason}
            onPress={() => setSelectedReason(reason)}
            containerStyle={styles.checkBoxContainer}
            textStyle={styles.checkBoxText}
          />
        </View>
      ))}

      {selectedReason === 'Others' && (
        <View style={styles.textInputContainer}>
          <Text style={styles.inputLabel}>Type the reason</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Tell doctor about your problem"
            maxLength={250}
            multiline
            value={otherReason}
            onChangeText={txt => setOtherReason(txt)}
          />
        </View>
      )}
      <Button
        title="Submit"
        buttonStyle={styles.submitButton}
        onPress={() => {
          if (selectedReason !== '') {
            onCancel(selectedReason);
            navigation.goBack();
          } else {
            onCancel(otherReason);
            navigation.goBack();
          }
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colorGlobal.black,
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  checkBoxText: {
    fontSize: 16,
  },
  textInputContainer: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#008C76',
    paddingVertical: 16,
    borderRadius: 8,
  },
});

export default CancelAppointment;
