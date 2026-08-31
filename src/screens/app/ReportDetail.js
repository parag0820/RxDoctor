import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import RNPrint from 'react-native-print';
import api from '../../utils/api';
import {colorGlobal} from '../../utils/GlobalStyles';

export default function ReportDetail({route}) {
  const reportId = route?.params?.reportId;
  const [details, setDetails] = useState(reportId);
  const [loading, setLoading] = useState(true);

  console.log('Selected Report ID:', reportId);
  setTimeout(() => {
    setLoading(false);
  }, 2000);

  // // ✅ Fetch report by ID directly
  // const fetchReportDetails = async () => {
  //   try {
  //     setLoading(true);

  //     // 👉 Recommended API (better way)
  //     const response = await api.get(`/testReport/view-by-id/${reportId}`);

  //     setDetails(response?.data);
  //   } catch (error) {
  //     console.log('API Error:', error);
  //     Alert.alert('Error', 'Failed to load report');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (reportId) {
  //     fetchReportDetails();
  //   }
  // }, [reportId]);

  // ✅ PDF GENERATION
  const generatePDF = async () => {
    if (!details) return;

    try {
      const html = `
      <html>
        <body style="font-family:Arial;padding:25px">
          <h2 style="text-align:center;color:#0A7AFF">
            City Care Hospital
          </h2>

          <hr/>

          <h3>Patient Information</h3>
          <p><b>Name:</b> ${details?.patientId?.fullname || ''}</p>
          <p><b>Age:</b> ${details?.patientId?.age || ''}</p>
          <p><b>Gender:</b> ${details?.patientId?.gender || ''}</p>
          <p><b>Date:</b> ${details?.date || ''}</p>
          <p><b>Time:</b> ${details?.time || ''}</p>

          <hr/>

          <h3>Test Details</h3>
          <p><b>Priority:</b> ${details?.priority || ''}</p>
          <p><b>Course:</b> ${details?.course || ''}</p>

          <h4>Lab Tests:</h4>
          <ul>
            ${(details?.labTest || []).map(test => `<li>${test}</li>`).join('')}
          </ul>

          <br/>
          <p><b>Doctor Notes:</b></p>
          <p>${details?.other || 'No notes provided'}</p>

          <br/><br/>
          <p><b>Doctor Signature</b></p>
        </body>
      </html>
      `;

      await RNPrint.print({html});
    } catch (error) {
      Alert.alert('Error', 'PDF generation failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colorGlobal.themeColor} />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.loader}>
        <Text>No Report Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lab Report</Text>

      {/* Patient Info */}
      <View style={styles.card}>
        <Text style={styles.section}>Patient Information</Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Name: </Text>
          {details?.patientId?.fullname}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Age: </Text>
          {details?.patientId?.age}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Gender: </Text>
          {details?.patientId?.gender}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Date: </Text>
          {details?.date} | {details?.time}
        </Text>
      </View>

      {/* Test Details */}
      <View style={styles.card}>
        <Text style={styles.section}>Test Details</Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Priority: </Text>
          {details?.priority}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Course: </Text>
          {details?.course}
        </Text>

        <Text style={[styles.section, {marginTop: 10}]}>Lab Tests</Text>

        {(details?.labTest || []).map((item, index) => (
          <Text key={index} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        <Text style={[styles.section, {marginTop: 10}]}>Doctor Notes</Text>

        <Text style={styles.note}>{details?.other || 'No notes provided'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Download PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F6FA',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
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
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  label: {
    fontWeight: '600',
    color: '#000',
  },
  bullet: {
    fontSize: 14,
    marginLeft: 10,
    marginBottom: 4,
    color: '#444',
  },
  note: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
