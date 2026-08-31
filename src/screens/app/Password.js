import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import globalStyles from '../../utils/globalStyls';
import Input from '../../components/Input';
import NextButton from '../../components/NextButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import api from '../../utils/api';
import Toast from 'react-native-toast-message';

export default function Password() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const showToastPic = () => {
    Toast.show({
      type: 'success',
      text1: 'Password Updated Successfully!👍',
    });
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const EditProfileHandler = async () => {
    const userId = await AsyncStorage.getItem('userId');

    if (password !== '' && confirmPass !== '') {
      if (password === confirmPass) {
        try {
          const response = await api.put(`/doctorPanel/doctor-edit/${userId}`, {
            password,
          });
          console.log('Password Updated', response);
          showToastPic();
        } catch (error) {
          console.log('Response ERRor: ', error);
        }
      } else {
        setError('something went wrong');
      }
    } else {
      setError('password and confirm password required');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.inputHeading, {marginVertical: 10}]}>
        CHANGE YOUR PASSWORD
      </Text>
      <View>
        <Text style={globalStyles.inputHeading}>New Password</Text>
        <Input
          placeholder={'Enter Your New Password'}
          onChangeText={txt => {
            setPassword(txt);
          }}
          value={password}
        />
        <Text style={globalStyles.inputHeading}>Confirm Password</Text>
        <Input
          placeholder={'Confirm Your New Password'}
          onChangeText={txt => {
            setConfirmPass(txt);
          }}
          value={confirmPass}
        />
        {error ? <Text style={globalStyles.error}>{error}</Text> : null}
        <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
          <NextButton onPress={EditProfileHandler} label={'UPDATE'} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    // justifyContent: 'center',
  },
});
