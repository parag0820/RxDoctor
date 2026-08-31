import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
      <View style={styles.personalDetailsView}>
        <View style={globalStyles.profileImageView}>
          <Image
            style={globalStyles.profileImage}
            source={{
              uri: `${BASE_URL}Images/${DoctorDetails?.image}`,
            }}
          />
        </View>
        <View style={styles.innerView}>
          <Text
            style={styles.nameText}>{`Name: ${DoctorDetails.fullname}`}</Text>
          <View style={globalStyles.spaceLine}></View>
          <Text
            style={[
              styles.professionalDetailsText,
            ]}>{`City : ${DoctorDetails.city}`}</Text>
        </View>
      </View>
      <FlatList
        data={PatientDetails}
        renderItem={({item}) => (
          <View
            style={{paddingHorizontal: scale(15), paddingVertical: scale(10)}}>
            <Text style={styles.nameText}>Scheduled Appointment</Text>
            <Text style={styles.professionalDetailsText}>
              Date : {item.date}
            </Text>
            <Text style={styles.professionalDetailsText}>
              Time : {item.time}
            </Text>

            <Text style={styles.nameText}>Patient Information</Text>
            <Text style={styles.professionalDetailsText}>
              {`Full Name :   ${item.fullName}`}
            </Text>
            <Text style={styles.professionalDetailsText}>
              {`Age : ${item.age}`}
            </Text>
            <Text style={styles.professionalDetailsText}>
              {'Gender       :  '}
              {item.gender}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <View>
                <Text style={styles.professionalDetailsText}>
                  {`Appointment Type     : ${item.appointmentType} `}
                </Text>
                <Text style={styles.professionalDetailsText}>
                  {`Disease     : ${item.aboutDiseases} `}
                </Text>
              </View>
              <View style={{paddingRight: 20}}>
                <Text
                  style={[
                    styles.professionalDetailsText,
                    {marginRight: 20, paddingRight: 20},
                  ]}></Text>
              </View>
            </View>

            <IntegrationButton
              onPress={() => {
                const currentDate = moment().format('YYYY-MM-DD');

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
                  Alert.alert('The appointment is not valid for this action.');
                  setErrorMessage(
                    'The appointment is not valid for this action',
                  );
                }
              }}
              label={`${item.appointmentType}`}
              disabled={!isButtonPressable(item)}
            />
            {errorMessage ? (
              <Text style={globalStyles.error}>{errorMessage}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorGlobal.lightWhite,
  },
  loadingContainer: {
    justifyContent: 'center',
  },
  personalDetailsView: {
    marginHorizontal: scale(15),
    flexDirection: 'row',
    backgroundColor: colorGlobal.white,
    borderRadius: 10,
    elevation: 2,
    marginVertical: scale(10),
    overflow: 'hidden',
  },
  innerView: {
    justifyContent: 'center',
  },
  nameText: {
    fontSize: scale(18),
    color: colorGlobal.black,
    fontWeight: 'bold',
    paddingVertical: scale(5),
  },
  professionalDetailsText: {
    color: colorGlobal.black,
    fontSize: scale(12),
    fontWeight: '500',
    marginVertical: scale(2),
    textAlign: 'left',
  },
});
