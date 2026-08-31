import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, {useState} from 'react';
import {scale, verticalScale, vs} from 'react-native-size-matters';
import reset from '../../assets/reset.jpg';
import {colorGlobal} from '../../utils/globalStyls';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../../utils/globalStyls';
import Toast from 'react-native-toast-message';

export default function ResetPass({navigation}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [error, setError] = useState(false);

  const showToast = () => {
    Toast.show({
      type: 'success', // Can be 'success', 'error', or 'info'
      text1: 'Success', // Main title
      text2: 'Your password has changed.', // Sub-message
    });
    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
  };

  const changeHandler = async () => {
    const userId = await AsyncStorage.getItem(`userIdReset`);
    if (password === '' || confirmPassword === '') {
      setError('password & confirmPassword required!');
    } else if (password === confirmPassword) {
      try {
        const response = await api.put(`/patient/update-password/${userId}`, {
          password,
          confirmPassword,
        });
        console.log('response ', response);
        await AsyncStorage.removeItem('userIdReset');
        showToast();
      } catch (err) {
        console.log(err);
      }
    } else {
      setError('passwords do not match!!');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.fristflex}>
          <View style={styles.arrowview}></View>
          <Image
            source={reset}
            style={{
              height: verticalScale(160),
              width: scale(200),
              marginTop: verticalScale(10),
            }}
          />
        </View>
        <View style={styles.secondflex}>
          <Text style={styles.signintext}>Create New Password</Text>
          <View style={styles.signView}>
            <View style={{marginLeft: scale(0)}}>
              <Text
                style={{
                  marginTop: verticalScale(10),
                  marginLeft: scale(-140),
                  fontWeight: '700',
                  fontSize: scale(14),
                  color: 'black',
                }}>
                Enter Password
              </Text>
            </View>
            <View style={styles.touchableOpecity}>
              <View style={styles.romaniyaInnerText}>
                <View style={styles.textInput}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={'gray'}
                    style={styles.TochableText1}
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{marginLeft: scale(0)}}>
                <Text
                  style={{
                    marginTop: verticalScale(15),
                    marginLeft: scale(0),
                    fontWeight: '700',
                    fontSize: scale(14),
                    color: 'black',
                  }}>
                  Enter Confirm Password
                </Text>
              </View>
              <View style={styles.touchableOpecity1}>
                <View style={styles.romaniyaInnerText}>
                  <View style={styles.textInput}>
                    <TextInput
                      placeholder="Confirm New Password"
                      placeholderTextColor={'gray'}
                      style={styles.TochableText1}
                      secureTextEntry={!isConfirmPasswordVisible}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.eyeIcon}
                      onPress={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={{flex: 0.5, marginTop: verticalScale(100)}}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.touchableOpecityUser}
                onPress={changeHandler}>
                <Text style={styles.TochableTextUser}>Continue</Text>
              </TouchableOpacity>
            </View>
            {error ? <Text style={globalStyles.error}>{error}</Text> : null}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: verticalScale(20),
  },
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: vs(-250),
    marginRight: scale(20),
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 5,
    fontSize: scale(14),
    color: 'black',
    fontWeight: '600',
  },

  arrowview: {
    backgroundColor: '#FFFFFF',
    marginLeft: scale(-30),
    marginTop: verticalScale(20),
    borderRadius: 5,
    height: vs(28),
    width: scale(29),
  },
  arrowicon: {
    color: 'black',
    margin: scale(2.5),
    alignItems: 'center',
    marginLeft: scale(2),
  },
  validationText: {
    color: 'red',
    marginTop: -5,
  },
  fristflex: {
    alignItems: 'center',
  },
  secondflex: {
    width: scale(320),
    backgroundColor: '#FFFFFF',
    borderColor: 'blue',
    marginTop: verticalScale(20),
    borderRadius: 40,
    paddingBottom: verticalScale(30),
  },
  signintext: {
    fontFamily: 'Salsa-Regular',
    fontSize: scale(25),
    textAlign: 'center',
    fontWeight: '700',
    color: 'black',
    marginTop: verticalScale(25),
  },
  imageromaiya: {
    height: verticalScale(20),
    width: scale(25),
    alignItems: 'center',
    marginLeft: scale(15),
    marginTop: verticalScale(10),
  },
  romaniyaInnerText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(-35),
    fontFamily: 'Poppins-Regular',
  },
  textInput: {
    textAlign: 'center',
    flexDirection: 'row',
    marginLeft: scale(10),
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  touchableOpecity: {
    borderRadius: 10,
    marginTop: verticalScale(5),
    width: scale(280),
    backgroundColor: colorGlobal.lightWhite,
    height: verticalScale(45),
    flexDirection: 'column',
  },
  touchableOpecity1: {
    backgroundColor: colorGlobal.lightWhite,
    borderRadius: 10,
    marginTop: verticalScale(5),
    width: scale(280),
    height: verticalScale(45),
    flexDirection: 'column',
  },
  TochableText: {
    color: 'black',
    flexDirection: 'column',
    textAlign: 'center',
    fontSize: scale(15),
    height: verticalScale(45),
    width: scale(320),
    fontWeight: '500',
    marginLeft: scale(-40),
    marginTop: verticalScale(15),
  },
  TochableText1: {
    color: 'black',
    marginTop: verticalScale(33),
    textAlign: 'left',
    fontSize: scale(14),
    height: verticalScale(45),
    width: scale(-90),
    fontWeight: '500',
  },
  eyeIcon: {
    position: 'absolute',
    marginLeft: scale(225),
    top: verticalScale(48),
  },
  touchableOpecityUser: {
    backgroundColor: colorGlobal.themeColor,
    borderRadius: 30,
    marginTop: verticalScale(30),
    width: scale(280),
    height: verticalScale(45),
  },
  TochableTextUser: {
    color: 'white',
    padding: scale(12),
    textAlign: 'center',
    fontSize: scale(18),
    height: scale(50),
    width: scale(320),
    fontWeight: '700',
    marginLeft: scale(-28),
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
