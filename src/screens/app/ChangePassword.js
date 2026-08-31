import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import TextInputPass from '../../components/TextInputPass';
import globalStyles, {colorGlobal} from '../../utils/globalStyls';
import {scale, verticalScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';

export default function ChangePassword({navigation}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Your password has changed.',
    });
    setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
  };

  const ChangePasswordHandler = async () => {
    if (password === '' || confirmPassword === '') {
      setError('password & confirmPassword required!');
    } else if (password === confirmPassword) {
      const userId = await AsyncStorage.getItem(`userIdReset`);
      try {
        const response = await api.put(
          `/doctorPanel/update-password/${userId}`,
          {
            password,
            confirmPassword,
          },
        );
        await AsyncStorage.removeItem('userIdReset');
        showToast();
      } catch (error) {
        console.log(error);
      }
    } else {
      setError('passwords do not match!!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ChangePassword</Text>
      <View style={{marginHorizontal: '10%'}}>
        <TextInputPass
          placeholder={'New Password'}
          onChangeText={txt => {
            setPassword(txt.trim(), true);
          }}
          value={password}
        />
        <TextInputPass
          placeholder={'Confirm Password'}
          onChangeText={txt => {
            setConfirmPassword(txt.trim(), true);
          }}
          value={confirmPassword}
        />
        {error ? <Text style={globalStyles.error}>{error}</Text> : null}
      </View>
      <TouchableOpacity
        style={styles.buttonView}
        onPress={ChangePasswordHandler}>
        <Text style={styles.rightNav}>Done</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colorGlobal.white,
  },
  heading: {
    color: '#000',
    fontWeight: '900',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 30,
  },
  buttonView: {
    backgroundColor: colorGlobal.themeColor,
    borderRadius: 15,
    marginTop: verticalScale(30),
    width: scale(275),
    height: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  rightNav: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 30,
    // paddingVertical: 10,
  },
});
