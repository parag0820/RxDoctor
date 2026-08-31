import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {colorGlobal} from '../../utils/globalStyls';

const AddUserModal = ({visible, onClose, patientId}) => {
  const [bloodPressure, setBloodPressure] = useState('');
  const [weight, setWeight] = useState('');
  const [prescription, setPrescription] = useState('');
  const [fever, setFever] = useState('');
  const [date, setDate] = useState('');
  const [oxygenLevel, setOxygenLevel] = useState('');

  // API function to submit form data
  const submitForm = async () => {
    const userId = await AsyncStorage.getItem(`userId`);
    const formData = {
      doctorId: userId,
      patientId: patientId,
      bloodPressure,
      weight,
      prescription,
      fever,
    };

    try {
      const response = await api.post(`/physicalList/add-physical`, formData);
      console.log(response.data);
      alert('Data Submitted Successfully');
      setBloodPressure('');
      setDate('');
      setFever('');
      setOxygenLevel('');
      setPrescription('');
      setWeight('');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error submitting data');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Patient's Diagnostic</Text>
          <TextInput
            placeholderTextColor={colorGlobal.gray}
            placeholder="Blood Pressure"
            value={bloodPressure}
            onChangeText={setBloodPressure}
            style={styles.input}
          />
          <TextInput
            placeholderTextColor={colorGlobal.gray}
            placeholder="Weight"
            value={weight}
            onChangeText={setWeight}
            style={styles.input}
          />

          <TextInput
            placeholderTextColor={colorGlobal.gray}
            placeholder="date"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />
          <TextInput
            placeholderTextColor={colorGlobal.gray}
            placeholder="oxygenLevel"
            value={oxygenLevel}
            onChangeText={setOxygenLevel}
            style={styles.input}
          />
          <TextInput
            placeholderTextColor={colorGlobal.gray}
            placeholder="Prescription"
            value={prescription}
            onChangeText={setPrescription}
            style={styles.input}
          />
          <TextInput
            placeholderTextColor={colorGlobal.gray}
            placeholder="Body Temperature"
            value={fever}
            onChangeText={setFever}
            style={styles.input}
          />
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={[
                styles.rechargeButton,
                {backgroundColor: colorGlobal.gray},
              ]}
              onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rechargeButton}
              onPress={submitForm}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
          {/*   <TouchableOpacity style={styles.button} onPress={submitForm}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          <Button title="Close" onPress={onClose} /> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: colorGlobal.black,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: colorGlobal.black,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rechargeButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
});

export default AddUserModal;
