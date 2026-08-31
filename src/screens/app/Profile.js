import Toast from 'react-native-toast-message';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useId, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
// import ProfileSetting from '../../components/ProfileSetting';
import Rating from '../../components/Rating';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../utils/baseUrl';
import ProfileSettings from '../../components/ProfileSettings';
import ProfileSetting from './ProfileSetting';
import {AuthContext} from '../context/AuthContext';

export default function Profile() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [modelVisible, setModelVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [rating, setUserRating] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {logout} = useContext(AuthContext);

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Logout successful 👋',
      text2: 'You have logged out successfully!',
    });
    setTimeout(() => {
      logout();
    }, 2000);
  };

  const ratingHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await api.get(`/docRate/rating/${userId}`);
      const avgRating = response.data.roundedRating;
      setUserRating(avgRating);
    } catch (error) {
      console.log(error.response);
    }
  };

  const userDataHandler = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      const response = await api.get('doctorPanel/viewAll');
      const data = response.data.data;
      const userDetails = data.find(item => item._id === userId);
      setProfileImage(userDetails?.image);
      setUserName(userDetails.fullname);
    } catch (error) {
      console.log(error);
    }
  };

  const clearToken = async () => {
    const keys = [
      'userToken',
      'userName',
      'userEmail',
      'userToken',
      'remainingAmount',
    ]; // Add all your token keys here

    try {
      const removePromises = keys.map(key => AsyncStorage.removeItem(key));
      await Promise.all(removePromises);

      console.log('Tokens cleared successfully');
      navigation.replace('LogIn');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      userDataHandler();
      ratingHandler();
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.innerView}>
        <Image
          style={styles.image}
          source={{
            uri: profileImage
              ? `${BASE_URL}Images/${profileImage}`
              : `https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png`,
          }}
        />
      </View>
      <Text style={styles.name}>
        {'Dr. '}
        {userName}
      </Text>
      <Rating value={rating} />

      <View style={styles.space}></View>
      <Toast />

      <ProfileSetting
        label="Edit Profile"
        leftIcon="person"
        rightIcon="chevron-right"
        onPress={() => navigation.navigate('EditProfile')}
      />

      <ProfileSetting
        label="Notification"
        leftIcon="notifications"
        rightIcon="chevron-right"
        onPress={() => navigation.navigate('Notifications')}
      />

      <ProfileSettings
        label={'Available'}
        logo={require('../../assets/available.png')}
        image={require('../../assets/right.png')}
        mode={true}
        rightIcon="chevron-right"
      />

      <ProfileSetting
        label="Dr. Available Time"
        leftIcon="schedule"
        rightIcon="chevron-right"
        onPress={() => navigation.navigate('CustomDatePicker')}
      />

      <ProfileSetting
        label="Wallet"
        leftIcon="account-balance-wallet"
        rightIcon="chevron-right"
        onPress={() => navigation.navigate('Wallet')}
      />

      <ProfileSetting
        label="History"
        leftIcon="work-history"
        rightIcon="chevron-right"
        onPress={() => navigation.navigate('History')}
      />

      <ProfileSetting
        label="Help & Support"
        leftIcon="help-outline"
        rightIcon="chevron-right"
        onPress={() => navigation.navigate('TicketList')}
      />
      <ProfileSetting
        label="PrivacyPolicy"
        leftIcon="assignment"
        rightIcon="chevron-right"
        onPress={() => navigation.navigate('PrivacyPolicy')}
      />
      <ProfileSetting
        label="Terms & Conditions"
        leftIcon="assignment"
        rightIcon="chevron-right"
        onPress={() => navigation.navigate('TermsConditions')}
      />

      <ProfileSetting
        label="Logout"
        leftIcon="logout"
        rightIcon={'chevron-right'}
        onPress={() => setLogoutModalVisible(true)}
      />
      <Modal
        transparent
        animationType="fade"
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Logout</Text>
            <Text style={styles.message}>Are you sure you want to logout?</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  setLogoutModalVisible(false);
                  showToast(); // your existing function
                }}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F7F9F9',
  },
  innerView: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imageSetting: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  name: {
    marginLeft: 10,
    alignSelf: 'center',
    color: '#000',
    fontWeight: '600',
    fontSize: 18,
  },
  orderView: {
    width: '50%',
    height: 50,
    backgroundColor: '#eaf9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    elevation: 1,
  },
  text: {
    color: '#000',
    fontSize: 14,
  },
  space: {
    height: 2,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#ccc',
  },
  spaceLiner: {
    marginTop: 7,
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
  },
  headings: {
    marginLeft: 5,
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
    marginHorizontal: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
  },

  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 15,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    alignItems: 'center',
  },

  cancelText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },

  logoutButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E53935',
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
