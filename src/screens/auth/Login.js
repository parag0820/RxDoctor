import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useContext, useState } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import globalStyles, { colorGlobal } from '../../utils/globalStyls';
import Input from '../../components/Input';
import TextInputPass from '../../components/TextInputPass';
import PrimaryButton from '../../components/PrimaryButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../../utils/Validation';
import { strings } from '../../utils/index';
import Loader from '../../components/Loadder';
import { AuthContext } from '../context/AuthContext';
import api from '../../utils/api';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async () => {
    setIsLoader(true);
    const userData = {
      email,
      password,
    };

    if (email !== '' && password !== '') {
      const emailValidated = validateEmail(email);
      if (emailValidated) {
        try {
          const response = await api.post('doctorPanel/login', userData);

          setIsLoader(false);
          const tokenResponse = response.data.user.token;
          const emailResponse = response.data.user.email;
          const nameResponse = response.data.user.fullname;
          const userId = response.data.user._id;
          login({
            token: tokenResponse,
            email: emailResponse,
            name: nameResponse,
            userId: userId,
          });
        } catch (error) {
          setIsLoader(false);

          if (error.response) {
            console.log(error.response.data.message);
            setErrorMessage(error.response.data.message);
          } else if (error.request) {
            console.log('Network issue: No response received');
            setErrorMessage('Network issue, please try again');
          } else {
            console.log('Error', error?.data?.message);
            setErrorMessage('Something went wrong, please try again');
          }
        }
      } else {
        console.log('Invalid Credentials');
        setErrorMessage('Invalid Credentials');
      }
    } else {
      console.log(emptyLogin);
      setErrorMessage(emptyLogin);
    }
  };

  const { emptyLogin } = strings;
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
        <View style={styles.secondFlex}>
          {<Loader size={'large'} color={'green'} animating={isLoader} />}
            <Image
              style={{
                alignSelf: 'center',
                width: scale(200),
                height: verticalScale(150),
                resizeMode: 'contain',
              }}
              source={require('../../assets/logo.png')}
            />
            <Text style={styles.signInText}>Login to Doctor App</Text>
            <Text style={globalStyles.inputHeading}>Email</Text>
            <Input
              placeholder={'Email'}
              autoCapitalize={'none'}
              keyboardType={'email-address'}
              onChangeText={txt => {
                setEmail(txt.trim(), true);
              }}
              value={email}
            />
            <Text style={globalStyles.inputHeading}>Password</Text>
            <TextInputPass
              placeholder={'password'}
              onChangeText={txt => {
                setPassword(txt.trim(), true);
              }}
              value={password}
            />
            {errorMessage ? (
              <Text style={globalStyles.error}>{errorMessage}</Text>
            ) : null}
            <PrimaryButton
              color={colorGlobal.themeColor}
              onPress={handleSubmit}
              label={'Sign In'}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword', { emailAddress: email });
              }}
              style={{ marginTop: 10, alignSelf: 'flex-end' }}>
              <Text style={{ color: colorGlobal.themeColor }}>Forgot Password</Text>
            </TouchableOpacity>
          <View style={styles.ask}>
            <Text style={styles.sininwithtext}>Don't Have an Account? </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              onPress={() => {
                navigation.navigate('SignUp');
              }}>
              <Text style={styles.rightNav}>Sign UP</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    paddingVertical: verticalScale(20),
  },
  secondFlex: {
    borderRadius: 40,
    width: scale(300),
    backgroundColor: '#FFFFFF',
    borderColor: 'blue',
    paddingBottom: verticalScale(20),
  },
  signInText: {
    fontFamily: 'Salsa-Regular',
    fontSize: scale(25),
    textAlign: 'center',
    fontWeight: '700',
    color: 'black',
    marginBottom: verticalScale(20),
  },
  sininwithtext: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: scale(14),
    color: colorGlobal.black,
  },
  ask: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 30,
  },
  rightNav: {
    fontSize: 16,
    color: colorGlobal.themeColor,
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
