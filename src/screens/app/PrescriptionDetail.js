import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNPrint from 'react-native-print';
import api from '../../utils/api';
import {colorGlobal} from '../../utils/GlobalStyles';
import globalStyls from '../../utils/globalStyls';

export default function PrescriptionDetail({route}) {
  const prescriptionId = route?.params?.prescriptionId;
  const [details, setDetails] = useState(null);
  // console.log('prescriptionId new pdf ', prescriptionId);
  console.log('prescriptionId items  ', details);

  const prescriptionDetails = async () => {
    try {
      const response = await api.get(`presFrom/view-id-pres/${prescriptionId}`);
      setDetails(response?.data?.prescription);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    prescriptionDetails();
  }, []);

  const medicine = details?.prescDoctor?.[0];

  const generatePDF = async () => {
    try {
      const html = `
      <html>
        <body style="font-family:Arial;padding:20px">
          <h2 style="text-align:center;color:#0A7AFF">
            City Care Hospital
          </h2>

          <p><b>Patient:</b> ${details?.patientName || ''}</p>
          <p><b>Doctor:</b> ${details?.doctorName || ''}</p>
          <p><b>Date:</b> ${medicine?.date || ''}</p>

          <h3>Medicine Details</h3>
          <table border="1" cellpadding="8" width="100%">
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Course</th>
              <th>Time</th>
            </tr>
            <tr>
              <td>${medicine?.medicine || ''}</td>
              <td>${medicine?.dosage || ''} times</td>
              <td>${medicine?.course || ''} days</td>
              <td>
                ${medicine?.medicineTime || ''} 
                (${medicine?.isDosageAfterFood || ''})
              </td>
            </tr>
          </table>

          <br/>
          <p><b>Doctor Notes:</b> ${details?.other || ''}</p>

          <br/><br/>
          <p><b>${details?.doctorName || ''}</b></p>
          <p>Doctor Signature</p>
        </body>
      </html>
      `;

      await RNPrint.print({
        html,
      });
    } catch (err) {
      Alert.alert('Error', 'PDF generation failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Prescription</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>Patient: {details?.patientName}</Text>
        <Text style={styles.cardText}>Doctor: {details?.doctorName}</Text>
        <Text style={styles.cardText}>Date: {medicine?.date}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Medicine</Text>
        <Text style={styles.cardText}>Name: {medicine?.medicine}</Text>
        <Text style={styles.cardText}>Dosage: {medicine?.dosage} times</Text>
        <Text style={styles.cardText}>Course: {medicine?.course} days</Text>
        <Text style={styles.cardText}>
          Time: {medicine?.medicineTime} ({medicine?.isDosageAfterFood})
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Download PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#F4F6FA'},
  title: {fontSize: 22, fontWeight: '700', textAlign: 'center', color: '#000'},
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  cardText: {fontSize: 14, marginBottom: 5, color: '#333'},
  section: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: colorGlobal.medicine,
  },
  button: {
    backgroundColor: colorGlobal.themeColor,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {color: '#fff', fontWeight: '700'},
});
