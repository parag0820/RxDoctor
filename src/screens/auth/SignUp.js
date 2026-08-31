import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../../components/Input';
import RegisterButton from '../../components/RegisterButton';
import TextInputPass from '../../components/TextInputPass';
import { scale, verticalScale } from 'react-native-size-matters';
import api from '../../utils/api';
import GlobalStyles, { colorGlobal } from '../../utils/GlobalStyles';
import { validateEmail } from '../../utils/Validation';
import Loader from '../../components/Loadder';
import { strings } from '../../utils';
import globalStyls from '../../utils/globalStyls';

export default function SignUp() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassWord] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [error, setError] = useState(null);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const showToastPic = () => {
    Toast.show({
      type: 'success',
      text1: 'Congratulations!👍',
      text2: 'Registered!',
    });
    setTimeout(() => {
      navigation.navigate('Verification', { verify: email });
    }, 2000);
  };

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        const source = { uri: `data:${image.mime};base64,${image.data}` };
        setImage(source);
      })
      .catch(error => {
        console.log('Image Picker Error: ', error);
      });
  };

  const handleSubmit = async () => {
    const status = 'Active';
    setIsLoader(true);
    if (email !== '' && password !== '' && city !== '') {
      const emailValidated = validateEmail(email);

      if (password === reenterPassword) {
        if (emailValidated) {
          const emailLowerCase = email.toLowerCase();
          console.log('EMAIL', emailLowerCase);
          const formData = new FormData();
          if (image) {
            formData.append('image', {
              uri: image.uri,
              name: 'profile.jpg',
              type: 'image/jpeg',
            });
          }
          formData.append('status', status);
          formData.append('fullname', fullname);
          formData.append('email', emailLowerCase);
          formData.append('mobileNumber', mobileNumber);
          formData.append('city', city);
          formData.append('password', password);
          formData.append('confirmPassword', reenterPassword);

          setError(null);
          console.log('formData', formData);

          try {
            const response = await api.post(`doctorPanel/signup`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log('formData', formData);
            // const userId = response.data.doctor._id;
            // await AsyncStorage.setItem('userId', userId);
            console.log('RESPONSE New User', response.data.doctor);
            setIsLoader(false);
            showToastPic();
          } catch (error) {
            console.log('catch error');
            setError(error.response.message);
          }
        } else {
          setError('invalid credentials');
        }
      } else {
        setError('incorrect password');
      }
    } else {
      setError('email, password, city are required!');
    }
  };

  const {
    namePlaceholder,
    mobilePlaceholder,
    emailPlaceholder,
    passwordPlaceHolder,
    submit,
  } = strings;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {isLoader ? (
          <Loader color={'green'} size={'large'} animating={isLoader} />
        ) : null}
          <Text
            style={{
              fontFamily: 'Salsa-Regular',
              fontSize: scale(25),
              textAlign: 'center',
              fontWeight: '700',
              color: 'black',
              marginVertical: verticalScale(20),
            }}>
            {isLoader ? <Toast /> : null}
            Doctor Rx Chart Square
          </Text>
          <View style={styles.innerView}>
            <Image
              style={styles.image}
              source={image ? image : require('../../assets/userLogin.png')}
            />
            <TouchableOpacity
              style={{ justifyContent: 'flex-end', marginBottom: 10 }}
              onPress={selectImage}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  position: 'absolute',
                  alignSelf: 'flex-end',
                }}
                source={require('../../assets/edit.png')}
              />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={GlobalStyles.inputHeading}>Enter Name</Text>
            <Input
              placeholder={namePlaceholder}
              onChangeText={txt => {
                setFullName(txt);
              }}
              value={fullname}
            />

            <Text style={globalStyls.inputHeading}>Enter Email</Text>
            <Input
              placeholder={emailPlaceholder}
              autoCapitalize={'none'}
              keyboardType={'email-address'}
              onChangeText={txt => {
                setEmail(txt.trim(), true);
              }}
              value={email}
            />
            <Text style={globalStyls.inputHeading}>Enter Password</Text>
            <TextInputPass
              placeholder={passwordPlaceHolder}
              onChangeText={txt => {
                setPassWord(txt.trim(), true);
              }}
              value={password}
            />
            <Text style={globalStyls.inputHeading}>Re-Enter Password</Text>
            <TextInputPass
              placeholder={'Enter your password again'}
              onChangeText={txt => {
                setReenterPassword(txt.trim(), true);
              }}
              value={reenterPassword}
            />
            <Text style={globalStyls.inputHeading}>Enter Mobile Number</Text>
            <Input
              placeholder={mobilePlaceholder}
              maxLength={10}
              keyboardType={'number-pad'}
              onChangeText={txt => {
                setMobileNumber(txt);
              }}
              value={mobileNumber}
            />
            <Text style={globalStyls.inputHeading}>Enter City</Text>
            <Input
              placeholder={'Enter Your City'}
              maxLength={10}
              onChangeText={txt => {
                setCity(txt);
              }}
              value={city}
            />

            {error ? (
              <Text style={{ color: 'red', alignSelf: 'flex-end' }}>{error}</Text>
            ) : null}
            <View>
              <View style={styles.policyRow}>
                <CheckBox
                  value={acceptedPolicy}
                  onValueChange={setAcceptedPolicy}
                  tintColors={{ true: colorGlobal.themeColor, false: '#999' }}
                />

                <Text style={styles.policyText}>
                  I agree to the{' '}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      navigation.navigate('TermsConditions', {
                        url: 'https://www.rxchartsquare.com/terms.html',
                      })
                    }>
                    Terms & Conditions
                  </Text>
                </Text>
              </View>
            </View>
            <RegisterButton
              color={acceptedPolicy ? colorGlobal.themeColor : '#ccc'}
              disabled={!acceptedPolicy}
              onPress={handleSubmit}
              label={submit}
            />
          <View style={styles.ask}>
            <Text style={styles.sininwithtext}>Already have an account? </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={styles.rightNav}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  innerView: {
    marginBottom: 5,
    flexDirection: 'row',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  dateText: {
    marginBottom: 20,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#EDEADE',
    borderRadius: 10,
    marginBottom: 10,
    color: 'gray',
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
    marginTop: 10,
    paddingBottom: 20,
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
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  policyText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
  },

  link: {
    color: colorGlobal.themeColor,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
