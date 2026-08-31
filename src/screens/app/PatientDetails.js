import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {scale} from 'react-native-size-matters';
import {useRoute} from '@react-navigation/native';
import Loader from '../../components/Loadder';
import AddUserModal from '../../components/modals/AddUserModal';
import api from '../../utils/api';
import BASE_URL from '../../utils/baseUrl';
import {colorGlobal} from '../../utils/globalStyls';
import GlobalStyles from '../../utils/GlobalStyles';

export default function PatientDetails({dr_name, dr_image, navigation}) {
  const route = useRoute();
  const patientId = route.params.id;
  const patientIds = route.params.patientId;
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const patientDetailsHandler = async () => {
    try {
      const response = await api.get(
        `/docReqAppointment/viewByIdReq/${patientId}`,
      );

      const array = [response.data.reqAppointment];

      setUserInfo(array);
      setImage(image);
      setName(name);
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    patientDetailsHandler();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader size="large" color={colorGlobal.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userInfo}
        renderItem={({item}) => (
          <View
            style={{paddingHorizontal: scale(15), paddingVertical: scale(10)}}>
            <View style={styles.personalDetailsView}>
              <View style={GlobalStyles.profileImageView}>
                <Image
                  style={styles.image}
                  source={{
                    uri: `${BASE_URL}Images/${item.patientId.image}`,
                  }}
                />
              </View>
              <View style={styles.innerView}>
                <Text style={styles.nameText}>
                  {`Mr. ${item.patientId.fullname}`}
                </Text>
                <View style={GlobalStyles.spaceLine}></View>
                <Text style={styles.professionalDetailsText}>
                  {`City: ${item.patientId.city}`}
                </Text>
                <Text style={styles.professionalDetailsText}>
                  {`Email: ${item.patientId.email}`}
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}></View>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    // setIsVisible(true);
                    navigation.navigate('PatientPrescription', {
                      patientId: patientIds,
                      patientName: userInfo[0].patientId.fullname,
                    });
                  }}>
                  <Text
                    style={[
                      styles.subHeading,
                      {color: colorGlobal.themeColor},
                    ]}>
                    Add Doctor Note
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    // setIsVisible(true);
                    navigation.navigate('PdfViewer', {
                      patientId: patientIds,
                    });
                  }}>
                  <Text
                    style={[
                      styles.subHeading,
                      {color: colorGlobal.themeColor},
                    ]}>
                    View Doctor Note
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    // setIsVisible(true);
                    navigation.navigate('PrescribeTest', {
                      patientId: patientIds,
                      patientName: userInfo[0].patientId.fullname,
                    });
                  }}>
                  <Text
                    style={[
                      styles.subHeading,
                      {color: colorGlobal.themeColor},
                    ]}>
                    Add Test Note
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => {
                    // setIsVisible(true);
                    navigation.navigate('PdfTestViewer', {
                      patientId: patientIds,
                    });
                  }}>
                  <Text
                    style={[
                      styles.subHeading,
                      {color: colorGlobal.themeColor},
                    ]}>
                    View Test Note
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.nameText}>About me</Text>
            <Text style={styles.subHeading}>
              {'Age: '}{' '}
              <Text style={styles.professionalDetailsText}>
                {item.patientId.age}
              </Text>
            </Text>
            <Text style={styles.subHeading}>
              {'City: '}{' '}
              <Text style={styles.professionalDetailsText}>
                {item.patientId.city}
              </Text>
            </Text>
            <Text style={styles.subHeading}>
              {'Weight: '}{' '}
              <Text style={styles.professionalDetailsText}>
                {item.patientId.weight} kg
              </Text>
            </Text>
            <Text style={styles.subHeading}>
              {'Mobile Number: '}{' '}
              <Text style={styles.professionalDetailsText}>
                {item.patientId.mobileNumber}
              </Text>
            </Text>
            <Text style={styles.subHeading}>
              {'Address: '}{' '}
              <Text style={styles.professionalDetailsText}>
                {item.patientId.address}
              </Text>
            </Text>
          </View>
        )}
      />
      <AddUserModal
        patientId={userInfo[0].patientId._id}
        visible={isVisible}
        onClose={() => {
          setIsVisible(false);
        }}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeading: {
    color: colorGlobal.black,
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 10,
  },
  personalDetailsView: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colorGlobal.white,
    borderRadius: 10,
    elevation: 2,
    overflow: 'hidden',
    alignSelf: 'center',
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
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 7,
  },
});
