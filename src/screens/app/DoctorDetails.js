import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colorGlobal} from '../../utils/globalStyls';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../utils/baseUrl';

export default function DoctorDetails({
  dr_image,
  dr_spesilazation,
  dr_hospital,
}) {
  const doctor = useSelector(state => state.doctor);
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute();
  const doctorid = route?.params?.doctorId;

  const fetchDoctors = async () => {
    try {
      const response = await api.get(`doctorPanel/viewAll`);
      const DocId = response?.data?.data;
      const DocDeatils = DocId.filter(item => item._id == doctorid);
      // console.log('Lof', DocDeatils[0].doctorAvailableTime[0].Monday);

      setDoctors(DocDeatils);
      setFilteredDoctors(response.data.data);
    } catch (error) {
      console.log('Error fetching data:', error.response);
    } finally {
      setLoading(false);
    }
  };

  //give rating

  const ratingHandler = async ratings => {
    const rating = ratings.toString();
    const ratingss = {rating};

    try {
      const response = await axios.post(`${BASE_URL}docRate/rating`, {
        doctorid,
        ratingss,
      });
    } catch (error) {
      console.error(
        'Error retrieving data from AsyncStorage:',
        error.response.data,
      );
    }
  };

  const ratingViewHandler = async () => {
    try {
      const response = await api.get(`/docRate/rating/${doctorid}`);
      setRating(response.data.roundedRating);
    } catch (error) {
      console.log(error.response);
    }
  };

  const ratings = r => {
    // showToast(r);
    ratingHandler(r);
  };

  // req to dr. for future appointment

  const sendRequestToDoctor = async () => {
    const userId = await AsyncStorage.getItem(`userId`);

    try {
      const data = {patientId: userId, doctorId: doctorid};
      const response = await api.post(`/docReqAppointment/addReq`, data);

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Home');
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    ratingViewHandler();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={doctors}
        renderItem={({item}) => (
          <View style={{flex: 1, paddingHorizontal: scale(15)}}>
            <View style={styles.personalDetailsView}>
              <View style={styles.profileImageView}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: `${BASE_URL}/Images/${item?.image}`,
                  }}
                />
              </View>
              <View style={styles.innerView}>
                <Text style={styles.nameText}>{`${item?.fullname}`}</Text>
                <View style={styles.spaceLine}></View>
                <Text
                  style={{
                    fontSize: scale(14),
                    color: 'black',
                    fontWeight: '400',
                  }}>
                  Spesilazation: {`${item?.specialization}`}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: scale(12), color: 'black'}}>
                    City: {`${item?.city}`}{' '}
                  </Text>
                  {/* | Exp. {`${item.experience}`} */}
                  {/* <Text style={{ fontSize: scale(12), color: 'black' }}>   Spesilazation: </Text> */}
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PdfViewer', {
                  doctorid: doctorid,
                });
              }}>
              <Text style={styles.docNote}>View Doctor Note</Text>
            </TouchableOpacity>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: colorGlobal.lightSeaGreen,
                    width: 80,
                    height: 80,
                    borderRadius: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.nameText,
                      {color: colorGlobal.themeColor, marginRight: 5},
                    ]}>
                    {item?.experience}
                  </Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 20,
                      tintColor: colorGlobal.themeColor,
                    }}
                    source={require('../../assets/graph.png')}
                  />
                </View>
                <Text
                  style={[
                    styles.professionalDetailsText,
                    {color: colorGlobal.black},
                  ]}>
                  experience
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: colorGlobal.lightSeaGreen,
                    width: 80,
                    height: 80,
                    borderRadius: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[styles.nameText, {color: colorGlobal.themeColor}]}>
                    {rating ? rating : null}
                  </Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 20,
                      tintColor: colorGlobal.themeColor,
                    }}
                    source={require('../../assets/star.png')}
                  />
                </View>
                <Text
                  style={[
                    styles.professionalDetailsText,
                    {color: colorGlobal.black},
                  ]}>
                  rating
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <View
                  style={{
                    backgroundColor: colorGlobal.lightSeaGreen,
                    width: 80,
                    height: 80,
                    flexDirection: 'row',
                    borderRadius: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[styles.nameText, {color: colorGlobal.themeColor}]}>
                    100
                  </Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 20,
                      tintColor: colorGlobal.themeColor,
                    }}
                    source={require('../../assets/reviewmessage.png')}
                  />
                </View>
                <Text
                  style={[
                    styles.professionalDetailsText,
                    {color: colorGlobal.black},
                  ]}>
                  reviews
                </Text>
              </View>
            </View>

            {/* <Text style={styles.nameText}>Rate Per minute</Text>
            <Text style={styles.professionalDetailsText}>₹ {item.ratePerMin}</Text> */}
            <View></View>
            <Text style={styles.nameText}>Fees</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <Text style={styles.professionalDetailsText}>
                Chat :{' '}
                <Text style={styles.subText}>
                  ₹ {item?.patientRatePerMinChatFee}/min
                </Text>
              </Text>

              <Text style={styles.professionalDetailsText}>
                Voice call :{' '}
                <Text style={styles.subText}>
                  ₹ {item?.patientRatePerMinVoiceFee}/min
                </Text>
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Text style={styles.professionalDetailsText}>
                Video call :{' '}
                <Text style={styles.subText}>
                  {' '}
                  ₹ {item?.patientRatePerMinVideoCallFee}/min
                </Text>
              </Text>

              <Text style={styles.professionalDetailsText}>
                In-Person Visit :{' '}
                <Text style={styles.subText}>
                  ₹ {item?.patientPersonalVisitFee}/min
                </Text>
              </Text>
            </View>

            {/* <Text style={styles.nameText}>Working Time</Text> */}

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.professionalDetailsText}>{item?.days}</Text>

              <View style={{justifyContent: 'space-evenly'}}>
                <Text style={[styles.nameText, {marginTop: 10}]}>
                  Working Time
                </Text>

                {item.doctorAvailableTime.map((time, index) => (
                  <View key={index} style={{marginBottom: 10}}>
                    {Object.keys(time).map(day => (
                      <View key={day} style={{marginBottom: 5}}>
                        <Text
                          style={[
                            styles.professionalDetailsText,
                            {
                              color: colorGlobal.themeColor,
                              fontWeight: '700',
                            },
                          ]}>
                          {day}
                        </Text>
                        <Text style={styles.professionalDetailsText}>
                          Available:{' '}
                          <Text style={styles.subText}>
                            {time[day]?.available.join(', ')}
                          </Text>
                        </Text>
                        <Text style={styles.professionalDetailsText}>
                          Slots:{' '}
                          <Text style={styles.subText}>
                            {time[day]?.slots.join(', ')}
                          </Text>
                        </Text>
                        <Text style={styles.professionalDetailsText}>
                          Unavailable:{' '}
                          <Text style={styles.subText}>
                            {time[day]?.unavailable.join(', ')}
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}

                <Text style={styles.nameText}>About me</Text>
                <Text style={styles.subText}>{item?.aboutMe}</Text>
              </View>
            </View>

            {/* <Text style={styles.nameText}>About me</Text>
            <Text style={styles.professionalDetailsText}>{item.details}</Text> */}
            {/* <Rating
              onFinishRating={ratings}
              style={{
                paddingVertical: 10,
                marginRight: 10,
                alignSelf: 'flex-end',
                backgroundColor:colorGlobal.lightWhite
              }}
              imageSize={18}
            /> */}
            <TouchableOpacity
              onPress={() => {
                sendRequestToDoctor();
                // navigation.navigate('PatientDeatils', {doctorId: doctorid})
              }}
              style={{
                height: verticalScale(45),
                width: scale(300),
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: verticalScale(30),
                marginBottom: verticalScale(50),
                borderRadius: 10,
                backgroundColor: colorGlobal.themeColor,
              }}>
              {/* <Text style={{ fontSize: scale(18), color: 'white', fontWeight: '600' }}>request for Book Appointment</Text> */}
              <Text
                style={{
                  fontSize: scale(18),
                  color: 'white',
                  fontWeight: '600',
                }}>
                Request to doctor
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Appointment request sent</Text>
            <Text style={styles.modalMessage}>
              Please wait until the doctor accepts your request
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorGlobal.lightWhite,
  },

  personalDetailsView: {
    flex: 1,
    marginHorizontal: scale(15),
    flexDirection: 'row',
    backgroundColor: colorGlobal.white,
    borderRadius: 10,
    elevation: 5,
    marginVertical: scale(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
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
    fontSize: scale(14),
    fontWeight: '700',
    marginVertical: scale(2),
  },
  profileImageView: {
    width: 110,
    height: 110,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
  },
  profileImage: {
    width: 90,
    height: 100,
    borderRadius: 8,
  },
  spaceLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: scale(2),
  },

  inputHeading: {
    color: '#000',
    fontWeight: '500',
    fontSize: scale(16),
  },

  inputPassView: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F1F1F1',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  subText: {fontWeight: '500', fontSize: scale(12), color: colorGlobal.black},
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    paddingVertical: 50,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: scale(16),
    fontWeight: '500',
    alignSelf: 'center',
    color: 'black',
    marginVertical: 10,
  },
  modalMessage: {
    textAlign: 'center',
    fontSize: scale(14),
    color: 'green',
  },
  docNote: {
    fontSize: 16,
    fontWeight: '500',
    color: colorGlobal.themeColor,
    textAlign: 'center',
  },
});
