import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import globalStyles, { colorGlobal } from '../../utils/globalStyls';
import SystemHeader from '../../components/SystemHeader';
import { useIsFocused } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {LocaleConfig} from 'react-native-calendars';
import Loader from '../../components/Loadder';
import api from '../../utils/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BASE_URL from '../../utils/baseUrl';

export default function Home({ navigation }) {
  const [appointmentData, setAppointmentData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [PrescriptionData, setPrescriptionData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [userImage, setUserImage] = useState('');
  const [available, setUserAvailable] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAppoint, setIsLoadingAppoint] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [isLoadingPrescription, setIsLoadingPrescription] = useState(true);
  const [selectedButtonAppointment, setSelectedButtonAppointment] =
    useState('');
  const [selectedButtonDiagnostic, setSelectedButtonDiagnostic] = useState('');
  const [selectedButtonPrescription, setSelectedButtonPrescription] =
    useState('');
  const isFocused = useIsFocused();

  // Api appointment
  const appointmentList = async () => {
    const userId = await AsyncStorage.getItem('userId');
    console.log('userID', userId);

    try {
      const response = await api.get(
        `patientPanel-appointment/viewDocId/${userId}`,
      );
      setAppointmentData(response.data.appointments);
      setIsLoadingAppoint(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Api Report dr.
  const reportHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(`/docDiagno/diagnoView`);
      setReportData(response.data.Diagno);
      setIsLoadingReport(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Api Prescription dr.
  const prescriptionHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      // const response = await api.get(`/docpres/presView`);
      const responsePrescription = await api.get(
        `/presFrom/view-by-doctor/${userId}`,
      );

      setPrescriptionData(responsePrescription?.data?.prescription);
      setIsLoadingPrescription(false);
    } catch (error) {
      console.log(error);
    }
  };

  // view all doc to find dr. name,city and id
  const userDetails = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(`/doctorPanel/viewAll`);
      const DocRes = response.data.data;
      const id = DocRes.filter(item => item._id == userId);
      // console.log(id[0].fullname);
      setIsLoading(false);
      setUserImage(id[0].image);
      setCity(id[0].city);
      setUserFullName(id[0].fullname);
      setUserAvailable(id[0].available);
    } catch (error) {
      console.log(error);
    }
    setUserId(userId);
  };

  useEffect(() => {
    if (isFocused) {
      appointmentList();
      userDetails();
      reportHandler();
      prescriptionHandler();
    }
  }, [isFocused]);

  const tabsButtonDetails = [
    { id: '1', label: 'Date' },
    { id: '2', label: 'Time' },
    { id: '3', label: 'Today Appointment' },
    { id: '4', label: 'Cancel Appointment' },
  ];

  /// falt data prop for appointment

  const Appointment = appointmentData;

  // todo Dinamic

  const Diagnostic = reportData;

  const Pharma = PrescriptionData;

  const buttonRegular = [
    { label: 'Today', key: 'today' },
    { label: 'Upcoming', key: 'Upcoming' },
    { label: 'History', key: 'See All' },
  ];
  const buttonAppointment = [
    { label: 'Today', key: 'today' },
    { label: 'Upcoming', key: 'Upcoming' },
    { label: 'History', key: 'See All' },
  ];

  const buttonDiagnostic = [
    { label: 'Today', key: 'today' },
    { label: 'History', key: 'See All' },
  ];

  const buttonPrescription = [
    { label: 'Today', key: 'today' },
    { label: 'History', key: 'See All' },
  ];

  const sections = [
    // {
    //   title: 'Regular Patients',
    //   data: Appointment,
    //   buttons: buttonRegular,
    //   selectedButton: selectedButtonRegular,
    //   setSelectedButton: setSelectedButtonregular,
    // },
    {
      title: 'Appointment',
      data: appointmentData,
      // buttons: buttonAppointment,
      selectedButton: selectedButtonAppointment,
      setSelectedButton: setSelectedButtonAppointment,
    },
    {
      title: 'Report',
      data: Diagnostic,
      // buttons: buttonDiagnostic,
      selectedButton: selectedButtonDiagnostic,
      setSelectedButton: setSelectedButtonDiagnostic,
    },
    {
      title: 'Prescription',
      data: Pharma,
      // buttons: buttonPrescription,
      selectedButton: selectedButtonPrescription,
      setSelectedButton: setSelectedButtonPrescription,
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'complete':
        return 'green';
      case 'pending':
        return 'red';
      case 'upcoming':
        return 'orange';
      default:
        return 'black';
    }
  };


  const handleDateSelect = day => {
    setSelectedDate(day.dateString);
    if (day.dateString == '2024-07-02') {
      navigation.navigate('Appointment', {
        date: day.dateString,
      });
    } else if (day.dateString == '2024-07-05') {
      navigation.navigate('Appointment', {
        date: day.dateString,
      });
    } else if (day.dateString == '2024-07-06') {
      navigation.navigate('Appointment', {
        date: day.dateString,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Loader
          color={colorGlobal.themeColor}
          size={'large'}
          animating={isLoading}
        />
      ) : (
        <View style={styles.container}>
          <Header
            notificationOnPress={() => {
              navigation.navigate('Notifications');
            }}
            userImage={userImage}
            nameOfDr={`Dr. ${userFullName}`}
            city={city}
            available={available}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SearchAllPatients');
            }}
            style={styles.searchBarView}>
            <Image
              style={styles.searchImage}
              source={require('../../assets/search.png')}
            />
            <Text style={styles.cardText}>Search...</Text>
          </TouchableOpacity>
          <View style={styles.iconView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('History', { type: 'message' });
              }}
              style={{
                alignSelf: 'flex-end',
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Ionicons
                style={styles.bellIcon}
                name="chatbox"
                size={30}
                color={colorGlobal.seaGreen}
              />
              <Text style={globalStyles.inputHeading}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('History', { type: 'voicecall' });
              }}
              style={{
                alignSelf: 'flex-end',
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <MaterialIcons
                style={styles.bellIcon}
                name="keyboard-voice"
                size={30}
                color={colorGlobal.seaGreen}
              />
              <Text style={globalStyles.inputHeading}>Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('History', { type: 'videocall' });
              }}
              style={{
                alignSelf: 'flex-end',
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Ionicons
                style={styles.bellIcon}
                name="videocam"
                size={30}
                color={colorGlobal.seaGreen}
              />
              <Text style={globalStyles.inputHeading}>Video</Text>
            </TouchableOpacity>

          </View>

          <FlatList
            data={sections}
            keyExtractor={(item, index) => item.title + index}
            ListHeaderComponent={
              <View>
                <View>

                </View>
              </View>
            }
            renderItem={({ item: section }) => (
              <View key={section.title}>
                <View style={styles.headerContainer}>
                  <SystemHeader
                    label={section.title}
                    onPress={() => navigation.navigate(section.title)}
                  />
                </View>

                <FlatList
                  horizontal
                  data={section.data}
                  keyExtractor={item => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (section.title === 'Appointment') {
                          navigation.navigate('MyAppointment', {
                            id: item._id,
                          });
                        } else if (section.title === 'Report') {
                          navigation.navigate('Report');
                        } else if (section.title === 'Prescription') {
                          navigation.navigate('PrescriptionDetail', {
                            prescriptionId: item?._id,
                          });
                        }
                      }}
                      key={item.id}
                      style={styles.card}>
                      <View style={styles.cardContent}>
                        {section.title === 'Appointment' && (
                          <>
                            <Image
                              source={{
                                uri: item.patientId?.image
                                  ? `${BASE_URL}Images/${item?.patientId?.image}`
                                  : null,
                              }}
                              style={styles.image}
                            />
                            <Text style={styles.nameText}>
                              Name:{' '}
                              <Text style={styles.cardText}>
                                {item?.fullName}
                              </Text>
                            </Text>
                            <View style={styles.underLinerView}></View>
                            <Text style={styles.nameText}>
                              Appointment Type:{' '}
                              <Text style={styles.cardText}>
                                {item?.appointmentType.toUpperCase()}
                              </Text>
                            </Text>
                            <Text style={styles.nameText}>
                              Diseases:{' '}
                              <Text style={styles.cardText}>
                                {item?.aboutDiseases}
                              </Text>
                            </Text>
                            <Text style={styles.nameText}>
                              City:{' '}
                              <Text style={styles.cardText}>
                                {item.patientId?.city}
                              </Text>
                            </Text>
                            <Text style={styles.nameText}>
                              Status:
                              <Text
                                style={[
                                  styles.cardText,
                                  {
                                    color:
                                      item.status === 'Pending'
                                        ? 'orange'
                                        : item.status === 'Accept'
                                          ? 'green'
                                          : item.status === 'Reject'
                                            ? 'red'
                                            : '#000',
                                  },
                                ]}>
                                {` ${item.status}`}
                              </Text>
                            </Text>
                            {/*    <Text style={styles.cardText}>
                              date: {item.date}
                            </Text>
                            <Text style={styles.cardText}>
                              time: {item.time}
                            </Text> */}
                          </>
                        )}
                        {section.title === 'Report' && (
                          <>
                            <Image
                              source={{
                                uri: `https://www.calciumhealth.com/wp-content/uploads/2020/07/Depositphotos_133833212_xl-2015-1024x683.jpg`,
                              }}
                              style={styles.image}
                            />
                            <Text style={styles.nameText}>
                              Test:{' '}
                              <Text style={styles.cardText}>
                                {item.testName}
                              </Text>
                            </Text>

                            <Text style={styles.nameText}>
                              Patient Name:{' '}
                              <Text style={styles.cardText}>
                                {item.patientName}
                              </Text>
                            </Text>

                            <Text style={styles.nameText}>
                              Price:{' '}
                              <Text style={styles.cardText}>{item.price}</Text>
                            </Text>
                            <Text style={styles.nameText}>
                              Status:
                              <Text style={styles.cardText}>
                                {` `}
                                <Text
                                  style={[
                                    styles.cardText,
                                    {
                                      color:
                                        item.status === 'Pending'
                                          ? 'orange'
                                          : item.status === 'Completed'
                                            ? 'green'
                                            : item.status === 'Reject'
                                              ? 'red'
                                              : '#000',
                                    },
                                  ]}>
                                  {item.status}
                                </Text>
                              </Text>
                            </Text>
                          </>
                        )}
                        {section.title === 'Prescription' && (
                          <>
                            <Image
                              source={{
                                uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmJf1llnZyUaBzGWSlaT6AGbpFsgynb7Nbww&s`,
                              }}
                              style={styles.image}
                            />
                            <Text style={styles.nameText}>
                              Dr. name:{' '}
                              <Text style={styles.cardText}>
                                {item.doctorName}
                              </Text>
                            </Text>
                            <Text style={styles.nameText}>
                              Patient Name:{' '}
                              <Text style={styles.cardText}>
                                {item.patientName}
                              </Text>
                            </Text>
                            <Text style={styles.nameText}>
                              Date:{' '}
                              <Text style={styles.cardText}>
                                {item?.prescDoctor[0]?.date}
                              </Text>
                            </Text>
                            {/* <Text style={styles.nameText}>
                              Status:
                              <Text
                                style={[
                                  styles.cardText,
                                  {
                                    color:
                                      item.status === 'Pending'
                                        ? 'orange'
                                        : item.status === 'Completed'
                                        ? 'green'
                                        : item.status === 'Reject'
                                        ? 'red'
                                        : '#000',
                                  },
                                ]}>
                                {item.status}
                              </Text>
                            </Text> */}
                          </>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorGlobal.lightWhite,
  },
  imageView: { alignItems: 'center', alignSelf: 'center', marginTop: 20 },
  chatImage: {
    width: 150,
    height: 150,
  },
  headerContainer: {
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBarView: {
    width: '90%',
    height: 50,
    borderRadius: scale(20),
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: scale(10),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    backgroundColor: colorGlobal.white,
  },
  searchImage: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorGlobal.black,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
  },
  selectedButton: {
    backgroundColor: colorGlobal.primary,
  },
  buttonText: {
    fontSize: 14,
    color: colorGlobal.black,
  },
  calenderContainer: {
    alignSelf: 'center',
    marginVertical: scale(10),
    backgroundColor: '#fff',
    paddingVertical: scale(10),
    paddingHorizontal: scale(5),
    elevation: 2,
    borderRadius: 10,
  },
  selectedButtonText: {
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: colorGlobal.white,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
    alignSelf: 'center',
  },
  cardContent: {
    flex: 1,
  },
  nameText: {
    fontSize: scale(14),
    marginBottom: 5,
    fontWeight: '700',
    color: colorGlobal.black,
  },
  cardText: {
    fontSize: scale(12),
    marginBottom: 5,
    fontWeight: '500',
    color: colorGlobal.black,
  },
  underLinerView: {
    width: '90%',
    height: 1,
    marginVertical: 3,
    backgroundColor: colorGlobal.gray,
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
