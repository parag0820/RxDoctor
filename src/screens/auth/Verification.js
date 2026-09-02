import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {useState, useEffect, useRef} from 'react';
import {scale, verticalScale, vs} from 'react-native-size-matters';
import {useOtpVerify, getHash, startOtpListener} from 'react-native-otp-verify';
import forget from '../../assets/otp_image.jpeg';
import back from '../../assets/backI.png';
import globalStyles, {colorGlobal} from '../../utils/globalStyls';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import {useRoute} from '@react-navigation/native';

export default function Verification({navigation}) {
  const [timer, setTimer] = useState(30);
  const [resendClicked, setResendClicked] = useState(false);
  const route = useRoute();
  const email = route?.params?.forget;
  const verify = route?.params?.verify;
  console.log('Email For VERify', verify);

  const [otpv, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const {startListener, stopListener} = useOtpVerify({numberOfDigits: 6});
  const [error, setError] = useState('');

  useEffect(() => {
    const initiateOtpListener = () => {
      startListener(message => {
        const extractedOtp = /(\d{6})/g.exec(message)?.[1];
        if (extractedOtp) {
          const otpArray = extractedOtp.split('');
          setOtp(otpArray);
          otpArray.forEach((digit, index) => {
            if (inputRefs[index].current) {
              inputRefs[index].current.setNativeProps({text: digit});
            }
          });
        }
      });
    };

    initiateOtpListener();

    return () => {
      stopListener();
    };
  }, [startListener, stopListener]);

  useEffect(() => {
    let interval = null;
    if (resendClicked && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else if (timer === 0) {
      setResendClicked(false);
    }
    return () => clearInterval(interval);
  }, [resendClicked, timer]);

  const handleChangeText = (text, index) => {
    const newOtp = [...otpv];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < 5) {
      inputRefs[index + 1].current.focus();
    }

    if (text.length === 0 && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleResendCode = () => {
    if (!resendClicked || timer === 0) {
      setResendClicked(true);
      setTimer(30);
      stopListener();
      setOtp(['', '', '', '']);
      inputRefs.forEach(ref => ref.current.clear());
      startListener(message => {
        const extractedOtp = /(\d{6})/g.exec(message)?.[1];
        if (extractedOtp) {
          const otpArray = extractedOtp.split('');
          setOtp(otpArray);
          otpArray.forEach((digit, index) => {
            if (inputRefs[index].current) {
              inputRefs[index].current.setNativeProps({text: digit});
            }
          });
        }
      });
    }
  };

  const verificationHandler = async () => {
    const doctorId = await AsyncStorage.getItem('userId');
    const email = verify;
    const str = otpv.toString();

    const otp = str.replace(/,/g, '');
    const payload = {email, otp};

    try {
      const response = await api.post(`doctorPanel/verify`, payload);

      navigation.navigate('Login');
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const verificationForget = async () => {
    if (otpv.every(item => item === '')) {
      setError('enter otp first');
    } else if (otpv) {
      setError('');
      const str = otpv.toString();
      const otp = str.replace(/,/g, '');
      console.log('Email Verify', email, otp);

      try {
        const response = await api.post(`/doctorPanel/reset-password-verify`, {
          email: email.toLowerCase(),
          otp,
        });
        console.log('response', response?.data?.message);
        if (response?.data?.message === 'OTP matched successfully') {
          navigation.navigate('ChangePassword');
        } else {
          setError('please try after sometime!');
        }
      } catch (err) {
        setError('wrong OTP');
        console.log(err);
      }
    } else {
    }
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
      <View style={styles.fristflex}>
        <TouchableOpacity
          style={styles.arrowview}
          onPress={() => navigation.goBack()}>
          <Image
            style={{
              width: 24,
              height: 24,
            }}
            source={back}
          />
        </TouchableOpacity>
        <View>
          <Image
            source={forget}
            style={{
              height: verticalScale(150),
              width: scale(250),
              marginTop: verticalScale(20),
            }}
          />
        </View>
      </View>
      <View style={styles.secondflex}>
        <Text style={styles.signintext}>Verification</Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: scale(14),
            marginTop: verticalScale(10),
            color: 'black',
          }}>
          Code has been sent to email address
        </Text>
        <View style={styles.signView}>
          <View style={{flexDirection: 'row', marginLeft: scale(-20)}}>
            <View style={styles.container}>
              {otpv.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.input}
                  value={digit}
                  onChangeText={text => handleChangeText(text, index)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ))}
            </View>
          </View>
          <View style={{flex: 0.5}}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.touchableOpecityUser}
              onPress={email ? verificationForget : verificationHandler}>
              <Text style={styles.TochableTextUser}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
        {error ? <Text style={globalStyles.error}>{error}</Text> : null}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: vs(10),
          }}>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={resendClicked && timer > 0}>
            <Text style={styles.sendCode}>
              {resendClicked && timer > 0
                ? `Resend code in: ${timer < 10 ? `0${timer}` : timer}`
                : 'Resend code'}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingLeft: scale(30),
    flexDirection: 'row',
    paddingRight: scale(10),
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    width: '14%',
    color: '#000',
    borderWidth: 1,
    borderColor: colorGlobal.themeColor,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center',
    justifyContent: 'space-between',
  },
  arrowview: {
    marginLeft: scale(-20),
    marginTop: verticalScale(20),
    borderRadius: 5,
    height: vs(28),
    width: scale(29),
    justifyContent: 'center',
  },
  arrowicon: {
    color: 'black',
    margin: scale(2.5),
    alignItems: 'center',
    marginLeft: scale(2),
  },
  sendCode: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: colorGlobal.themeColor,
    textAlign: 'center',
    margin: scale(10),
  },
  /* fristflex: {
    flex: 0.35,
    height: verticalScale(200),
    width: scale(350),
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    // backgroundColor: '#1A81C4',
    position: 'absolute',
  }, */
  secondflex: {
    flex: 0.9,
    height: verticalScale(450),
    width: scale(320),
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderColor: 'blue',
    marginTop: verticalScale(230),
    borderRadius: 40,
  },
  signintext: {
    fontFamily: 'Salsa-Regular',
    fontSize: scale(27),
    textAlign: 'center',
    fontWeight: '700',
    color: 'black',
    marginTop: verticalScale(25),
  },
  textInput: {
    textAlign: 'center',
    fontSize: scale(25),
    marginLeft: scale(20),
    color: 'black',
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 10,
    height: vs(40),
    width: scale(43),
  },
  touchableOpecityUser: {
    backgroundColor: colorGlobal.themeColor,
    borderRadius: 30,
    marginTop: verticalScale(50),
    width: scale(250),
    height: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  TochableTextUser: {
    color: 'white',
    padding: scale(12),
    textAlign: 'center',
    fontSize: scale(19),
    height: scale(50),
    width: scale(320),
    fontWeight: '700',
    fontFamily: 'Roboto-Regular',
  },
  signView: {
    flex: 0.5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});
