import RNPrint from 'react-native-print';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';

export default function PdfViewer() {
  const isDarkMode = useColorScheme() === 'dark';
  const [prescription, setPrescription] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({});
  const route = useRoute();
  const patientId = route?.params?.patientId;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      const [presResponse, doctorResponse] = await Promise.all([
        api.get(`/presFrom/view-by-patient/${patientId}`),
        api.get(`/doctorPanel/viewById/${userId}`),
      ]);

      setPrescription(presResponse?.data?.prescription || []);
      setDoctorInfo(doctorResponse?.data?.data || {});
    } catch (error) {
      console.log('Error fetching data:', error.message);
    }
  };

  const createPDF = async () => {
    if (!prescription.length) {
      Alert.alert('No Data', 'Prescription not available');
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: Arial; padding: 16px; }
            h2 { text-align: center; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Prescription</h2>

          <div class="section">
            <p><span class="label">Doctor:</span> ${
              doctorInfo?.fullname || 'N/A'
            }</p>
            <p><span class="label">Hospital:</span> ${
              doctorInfo?.hospital || 'N/A'
            }</p>
          </div>

          ${prescription
            .map(item => {
              const {prescDoctor = [], other} = item;
              return `
                <div class="section">
                  ${prescDoctor
                    .map(
                      el => `
                        <p><span class="label">Date:</span> ${
                          el.date || 'N/A'
                        }</p>
                        <p><span class="label">Time:</span> ${
                          el.time || 'N/A'
                        }</p>
                        <p><span class="label">Medicine:</span> ${
                          el.medicine || 'N/A'
                        }</p>
                        <p><span class="label">Dosage:</span> ${
                          el.dosage || 'N/A'
                        }</p>
                        <p><span class="label">Course:</span> ${
                          el.course || 'N/A'
                        }</p>
                        <hr />
                      `,
                    )
                    .join('')}
                  <p><span class="label">Other Notes:</span> ${
                    other || 'N/A'
                  }</p>
                </div>
              `;
            })
            .join('')}
        </body>
      </html>
    `;

    try {
      await RNPrint.print({html: htmlContent});
    } catch (error) {
      Alert.alert('Error', 'Failed to open print dialog');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView style={backgroundStyle}>
        <View
          style={[
            styles.container,
            {backgroundColor: isDarkMode ? Colors.black : Colors.white},
          ]}>
          <TouchableOpacity style={styles.button} onPress={createPDF}>
            <Text style={styles.btnText}>View / Save PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('screen').height * 0.5,
  },
  button: {
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
