import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { scale, verticalScale, vs } from 'react-native-size-matters';
import ForgetComponent from '../../components/ForgetComponent';
import forget from '../../assets/otp_image.jpeg';
import globalStyles, { colorGlobal } from '../../utils/globalStyls';
import Input from '../../components/Input';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ForgotPassword({ navigation }) {
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [phone, setPhone] = useState('');
  const [clickable, setClickable] = useState('gray');
  const [clickable2, setClickable2] = useState('gray');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validatePhone = phone => {
    setPhone(phone);
    const phonePattern = /^[0-9]{10}$/;
    setIsValidPhone(phonePattern.test(phone) || phone === '');
  };

  const handlePress1 = () => {
    setClickable(clickable === 'gray' ? colorGlobal.themeColor : 'gray');
    setClickable2('gray');
  };

  const handlePress2 = () => {
    setClickable2(clickable2 === 'gray' ? colorGlobal.themeColor : 'gray');
    setClickable('gray');
  };

  const handler = async () => {
    if (email === '') {
      setError('enter email first');
    } else if (email) {
      setEmail('');
      console.log('email', email);

      try {
        const response = await api.post(`/doctorPanel/reset-password`, {
          email: String(email || '')
            .toLowerCase()
            .trim(),
        });

        console.log('res', response?.data?.doctor?._id);
        await AsyncStorage.setItem('userIdReset', response?.data?.doctor?._id);
        navigation.navigate('Verification', {
          forget: email.toLowerCase(),
        });
      } catch (er) {
        setError('enter correct email');
        console.log(er);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.fristflex}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack('');
              }}
              style={styles.arrowview}>
              <Image
                style={{ tintColor: '#000', width: 24, height: 24 }}
                source={require('../../assets/backI.png')}
              />
            </TouchableOpacity>

            <Image
              source={forget}
              style={{
                height: verticalScale(170),
                width: scale(240),
                marginTop: verticalScale(10),
                alignSelf: 'center',
              }}
            />
          </View>
          <View style={styles.secondflex}>
            <Text style={styles.signintext}>Forgot Password</Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: scale(14),
                marginTop: verticalScale(10),
                color: 'black',
              }}>
              Please enter your email id {'\n'} to reset your password
            </Text>

            <View style={styles.signView}>
              <Input
                placeholder={'Enter Your Email Id'}
                autoCapitalize={'none'}
                onChangeText={txt => {
                  setEmail(txt);
                }}
                value={email}
              />
              {error ? <Text style={globalStyles.error}>{error}</Text> : null}
              <View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.touchableOpecityUser}
                  onPress={handler}
                >
                  <Text style={styles.TochableTextUser}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: verticalScale(20),
  },
  arrowview: {
    marginLeft: scale(20),
    marginTop: verticalScale(20),
    borderRadius: 5,
    height: vs(28),
    width: scale(29),
    justifyContent: 'center',
    alignItems: 'center',
  },

  fristflex: {
    width: scale(350),
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignSelf: 'center',
  },

  secondflex: {
    width: scale(320),
    backgroundColor: '#FFFFFF',
    borderColor: 'blue',
    marginTop: verticalScale(20),
    borderRadius: 40,
    paddingBottom: verticalScale(30),
    alignItems: 'center',
  },
  signintext: {
    fontFamily: 'Salsa-Regular',
    fontSize: scale(25),
    textAlign: 'center',
    fontWeight: '700',
    color: 'black',
    marginTop: verticalScale(25),
  },

  sininwithtext: {
    textAlign: 'center',
    marginTop: verticalScale(70),
    fontWeight: 'bold',
    fontSize: scale(16),
    color: 'black',
    fontFamily: 'Roboto-Regular',
  },

  touchableOpecity: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: verticalScale(30),
    width: scale(250),
    height: verticalScale(40),
    flexDirection: 'column',
  },

  touchableOpecityUser: {
    backgroundColor: colorGlobal.themeColor,
    borderRadius: 30,
    marginTop: verticalScale(50),
    width: scale(250),
    height: verticalScale(40),
  },
  TochableTextUser: {
    color: 'white',
    padding: scale(9),
    textAlign: 'center',
    fontSize: scale(19),
    height: scale(50),
    width: scale(320),
    fontWeight: '700',
    marginLeft: scale(-40),
    fontFamily: 'Roboto-Regular',
  },
  signView: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginHorizontal: 10,
    marginTop: vs(20),
  },
});
