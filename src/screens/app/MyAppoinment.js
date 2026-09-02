import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import globalStyles, {colorGlobal} from '../../utils/globalStyls';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import IntegrationButton from '../../components/IntegrationButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import Loader from '../../components/Loadder';
import moment from 'moment';
import BASE_URL from '../../utils/baseUrl';

export default function MyAppointment({route}) {
  const navigation = useNavigation();
  const [PatientDetails, setPatientDetails] = useState([]);
  const [DoctorDetails, setDoctorDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const id = route.params.id;

  const appointmentList = async () => {
    const userId = await AsyncStorage.getItem('userId');
    setDoctorId(userId);
    try {
      const response = await api.get(
        `patientPanel-appointment/viewDocId/${userId}`,
      );

      const filteredArray = response.data.appointments.filter(
        item => item._id == id,
      );
      // rooooom id

      const roomId = `159$${userId + filteredArray[0]._id}_`;
      console.log('ROOOOM', roomId);
      setRoomId(roomId);
      setPatientDetails(filteredArray);
      setDoctorDetails(filteredArray[0].patientId);
      console.log('data', filteredArray);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    appointmentList();
  }, []);

  const isButtonPressable = item => {
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm');
    return (
      item.status === 'Accept'
      // &&
      // item.date === currentDate &&
      // moment(item.time, 'HH:mm').isSameOrBefore(moment(currentTime, 'HH:mm'))
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Loader size="large" color={colorGlobal.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Premium Header Card */}
      <View style={styles.headerCard}>
        <Image
          style={styles.profileImage}
          source={
            !imageError &&
            DoctorDetails?.image &&
            DoctorDetails.image !== 'undefined' &&
            DoctorDetails.image !== 'null' &&
            DoctorDetails.image.trim() !== ''
              ? { uri: `${BASE_URL}Images/${DoctorDetails.image}` }
              : require('../../assets/default_patient.png')
          }
          onError={() => setImageError(true)}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {DoctorDetails?.fullname || 'Unknown Patient'}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#7F8C8D" />
            <Text style={styles.headerCity} numberOfLines={1}>
              {DoctorDetails?.city || 'Location not provided'}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={PatientDetails}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <View style={styles.detailsCard}>
            
            {/* Schedule Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={18} color={colorGlobal.themeColor} />
              <Text style={styles.sectionTitle}>Appointment Schedule</Text>
            </View>
            
            <View style={styles.scheduleRow}>
              <View style={styles.scheduleBox}>
                <Text style={styles.scheduleLabel}>Date</Text>
                <Text style={styles.scheduleValue}>{item.date}</Text>
              </View>
              <View style={styles.scheduleDivider} />
              <View style={styles.scheduleBox}>
                <Text style={styles.scheduleLabel}>Time</Text>
                <Text style={styles.scheduleValue}>{item.time}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Patient Info Section */}
            <View style={styles.sectionHeader}>
              <Ionicons name="person" size={18} color={colorGlobal.themeColor} />
              <Text style={styles.sectionTitle}>Patient Information</Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{item.age ? `${item.age} yrs` : 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{item.gender || 'N/A'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{item.appointmentType}</Text>
              </View>
            </View>

            <View style={styles.diseaseBox}>
              <Text style={styles.infoLabel}>Disease / Issue</Text>
              <Text style={styles.diseaseValue}>{item.aboutDiseases || 'Not specified'}</Text>
            </View>

            {/* Action Section */}
            <View style={styles.actionContainer}>
              <IntegrationButton
                onPress={() => {
                  if (isButtonPressable(item)) {
                    if (item.appointmentType === 'Chat') {
                      navigation.navigate('ChatSIO', {
                        roomId: roomId,
                        patientId: PatientDetails[0]._id,
                        doctorId: doctorId,
                        patientName: PatientDetails[0].fullName,
                      });
                    } else if (item.appointmentType === 'Audio Call') {
                      navigation.navigate('AgoraVoiceCall', {
                        patientId: PatientDetails[0]._id,
                        doctorId: doctorId,
                        patientName: PatientDetails[0].fullName,
                      });
                    } else if (item.appointmentType === 'Video Call') {
                      navigation.navigate('AgoraVideoCall', {
                        patientId: PatientDetails[0]._id,
                        doctorId: doctorId,
                        patientName: PatientDetails[0].fullName,
                      });
                    }
                  } else {
                    Alert.alert('Not Available', 'The appointment is not valid for this action yet.');
                    setErrorMessage('The appointment is not valid for this action');
                  }
                }}
                label={`Start ${item.appointmentType}`}
                disabled={!isButtonPressable(item)}
              />
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header Card
  headerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBF0F3',
    borderTopWidth: 0,
    marginBottom: 10,
  },
  profileImage: {
    width: scale(65),
    height: scale(65),
    borderRadius: scale(20),
    backgroundColor: '#F0F2F5',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  headerName: {
    fontSize: scale(18),
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCity: {
    fontSize: scale(12),
    color: '#7F8C8D',
    marginLeft: 4,
    fontWeight: '500',
  },

  // Details List
  listContent: {
    padding: 15,
    paddingBottom: 40,
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EBF0F3',
  },
  
  // Sections
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: scale(14),
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 8,
  },
  
  // Schedule
  scheduleRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBF0F3',
  },
  scheduleBox: {
    flex: 1,
    alignItems: 'center',
  },
  scheduleDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EBF0F3',
    marginHorizontal: 10,
  },
  scheduleLabel: {
    fontSize: scale(11),
    color: '#95A5A6',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: scale(14),
    fontWeight: '700',
    color: '#34495E',
  },
  
  divider: {
    height: 1,
    backgroundColor: '#EBF0F3',
    marginVertical: 12,
  },
  
  // Patient Info

  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBF0F3',
  },
  infoLabel: {
    fontSize: scale(11),
    color: '#95A5A6',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: scale(13),
    fontWeight: '700',
    color: '#34495E',
  },
  
  diseaseBox: {
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE3E3',
    marginBottom: 20,
  },
  diseaseValue: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#E74C3C',
    marginTop: 4,
  },
  
  // Actions
  actionContainer: {
    marginTop: 10,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: scale(12),
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
});
