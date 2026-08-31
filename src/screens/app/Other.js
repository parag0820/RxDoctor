import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserData, setField, updateProfile} from '../../redux/UserSlice';
import globalStyles from '../../utils/globalStyls';
import Input from '../../components/Input';
import NextButton from '../../components/NextButton';
import Toast from 'react-native-toast-message';

export default function Other() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    education,
    specialization,
    affiliations,
    researchAndPublications,
    hospital,
    personalVisitFee,
    ratePerMinChatFee,
    ratePerMinVoiceFee,
    ratePerMinVideoCallFee,
    error,
    status,
  } = useSelector(state => state.user);

  const showToastPic = () => {
    Toast.show({
      type: 'success',
      text1: 'Data Updated Successfully!👍',
    });
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const professionalHandler = () => {
    const formData = new FormData();

    formData.append('education', education);
    formData.append('specialization', specialization);
    formData.append('affiliations', affiliations);
    formData.append('researchAndPublications', researchAndPublications);
    formData.append('hospital', hospital);
    formData.append('personalVisitFee', parseInt(personalVisitFee)); // Convert to number
    formData.append('ratePerMinChatFee', parseInt(ratePerMinChatFee)); // Convert to number
    formData.append('ratePerMinVoiceFee', parseInt(ratePerMinVoiceFee)); // Convert to number
    formData.append('ratePerMinVideoCallFee', parseInt(ratePerMinVideoCallFee)); // Convert to number
    console.log('Testing?????', formData);

    dispatch(updateProfile(formData))
      .unwrap()
      .then(response => {
        showToastPic();
        console.log('PROFESSIONAL', response);
      })
      .catch(error => {
        console.log('Update Profile Error: ', error);
      });
  };

  // const professionalHandler = () => {
  //   const userDetails = {
  //     education,
  //     specialization,
  //     affiliations,
  //     researchAndPublications,
  //     hospital,
  //     personalVisitFee: Number(personalVisitFee), // Convert to number
  //     ratePerMinChatFee: Number(ratePerMinChatFee), // Convert to number
  //     ratePerMinVoiceFee: Number(ratePerMinVoiceFee), // Convert to number
  //     ratePerMinVideoCallFee: Number(ratePerMinVideoCallFee), // Convert to number
  //   };
  //   console.log('data', userDetails);

  //   dispatch(updateProfile(userDetails))
  //     .unwrap()
  //     .then(response => {
  //       showToastPic();
  //       console.log('PROFESSIONAL', response);
  //     })
  //     .catch(error => {
  //       console.log('Update Profile Error: ', error);
  //     });
  // };

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Text style={globalStyles.inputHeading}>Specializations</Text>
          <Input
            placeholder={'Interventional Cardiology'}
            onChangeText={txt =>
              dispatch(setField({field: 'specialization', value: txt}))
            }
            value={specialization}
          />
          <Text style={globalStyles.inputHeading}>
            Enter your price for chat
          </Text>
          <Input
            placeholder={'Enter per minute charges '}
            onChangeText={txt =>
              dispatch(setField({field: 'ratePerMinChatFee', value: txt}))
            }
            value={ratePerMinChatFee.toString()}
          />
          <Text style={globalStyles.inputHeading}>
            Enter your price for voice call
          </Text>
          <Input
            placeholder={'Enter per minute charges '}
            onChangeText={txt =>
              dispatch(setField({field: 'ratePerMinVoiceFee', value: txt}))
            }
            value={ratePerMinVoiceFee.toString()}
          />
          <Text style={globalStyles.inputHeading}>
            Enter your price for video call{' '}
          </Text>
          <Input
            placeholder={'Enter per minute charges '}
            onChangeText={txt =>
              dispatch(setField({field: 'ratePerMinVideoCallFee', value: txt}))
            }
            value={ratePerMinVideoCallFee.toString()}
          />
          <Text style={globalStyles.inputHeading}>
            Enter your price for personal visit{' '}
          </Text>
          <Input
            placeholder={'Enter per minute charges '}
            onChangeText={txt =>
              dispatch(setField({field: 'personalVisitFee', value: txt}))
            }
            value={personalVisitFee.toString()}
          />
          <Text style={globalStyles.inputHeading}>Educational Background</Text>
          <Input
            placeholder={'MBBS'}
            onChangeText={txt =>
              dispatch(setField({field: 'education', value: txt}))
            }
            value={education}
          />

          <Text style={globalStyles.inputHeading}>Affiliations</Text>
          <Input
            placeholder={'Example: Indian Medical Association (IMA)'}
            onChangeText={txt =>
              dispatch(setField({field: 'affiliations', value: txt}))
            }
            value={affiliations}
          />
          <Text style={globalStyles.inputHeading}>
            Research and Publications
          </Text>
          <Input
            placeholder={'Like Published numerous research papers'}
            onChangeText={txt =>
              dispatch(setField({field: 'researchAndPublications', value: txt}))
            }
            value={researchAndPublications}
          />
          <Text style={globalStyles.inputHeading}>Hospital/ Clinic</Text>
          <Input
            placeholder={'Enter Your Hospital Name'}
            onChangeText={txt =>
              dispatch(setField({field: 'hospital', value: txt}))
            }
            value={hospital}
          />
        </View>
      </ScrollView>
      <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
        <NextButton onPress={professionalHandler} label={'UPDATE'} />
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
    justifyContent: 'center',
  },
});
