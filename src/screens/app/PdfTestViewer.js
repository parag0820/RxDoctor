import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPrint from 'react-native-print';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';

export default function PdfTestViewer() {
  const isDarkMode = useColorScheme() === 'dark';

  const [prescription, setPrescription] = useState([]);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const route = useRoute();
  const {patientId} = route.params;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /* ================= FETCH DATA ================= */

  const prescriptionView = async () => {
    try {
      const docId = await AsyncStorage.getItem('userId');
      const response = await api.get(
        `/testReport/view-by-doctor/${patientId}/${docId}`,
      );
      setPrescription(response.data.prescription || []);
    } catch (error) {
      console.log('Prescription error:', error);
    }
  };

  const docDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await api.get(`/doctorPanel/viewById/${userId}`);

      const doc = response.data.data;
      setName(doc.fullname);
      setAddress(doc.address);
      setMobile(doc.mobileNumber);
      setEmail(doc.email);
    } catch (error) {
      console.log('Doctor details error:', error);
    }
  };

  /* ================= HTML ================= */

  const htmlContent = prescription
    .map(item => {
      const {
        patientId: patient,
        labTest,
        priority,
        course,
        other,
        date,
        time,
      } = item;

      return `
        <div style="padding:16px; font-family: Arial; page-break-after: always;">
          <h2 style="text-align:center;">Lab Test Report</h2>

          <div style="text-align:right;">
            <p><b>Date:</b> ${date || 'N/A'}</p>
            <p><b>Time:</b> ${time || 'N/A'}</p>
          </div>

          <hr/>

          <p><b>Doctor:</b> Dr. ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Mobile:</b> ${mobile}</p>
          <p><b>Address:</b> ${address}</p>

          <hr/>

          <h3>Patient: ${patient?.fullname || 'N/A'}</h3>

          <p><b>Lab Test:</b> ${labTest || 'N/A'}</p>
          <p><b>Priority:</b> ${priority || 'N/A'}</p>
          <p><b>Course:</b> ${course || 'N/A'}</p>
          <p><b>Other:</b> ${other || 'N/A'}</p>

          <hr/>
          <p style="text-align:center;">Contact: ${mobile} | ${email}</p>
        </div>
      `;
    })
    .join('');

  /* ================= PRINT ================= */

  const printPDF = async () => {
    try {
      await RNPrint.print({
        html: htmlContent,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to open print dialog');
    }
  };

  useEffect(() => {
    prescriptionView();
    docDetails();
  }, []);

  /* ================= UI ================= */

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.button} onPress={printPDF}>
          <Text style={styles.btnText}>View / Save PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: '10%',
  },
  button: {
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
