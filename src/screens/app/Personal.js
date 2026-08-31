import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import globalStyles from '../../utils/globalStyls';
import Input from '../../components/Input';
import NextButton from '../../components/NextButton';
import {fetchUserData, setField, updateProfile} from '../../redux/UserSlice';
import Toast from 'react-native-toast-message';
import {Dropdown} from 'react-native-element-dropdown';
import api from '../../utils/api';
import {Calendar} from 'react-native-calendars';
import {Modal} from 'react-native';
import moment from 'moment';

export default function Personal() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [imageGal, setImageGal] = useState(null);
  const [category, setCategory] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [getDocCategory, setGetDocCategory] = useState([]);
  const dispatch = useDispatch();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [calYear, setCalYear] = useState(moment().format('YYYY'));
  const [calMonth, setCalMonth] = useState(moment().format('MM'));

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 100}, (_, i) => {
    const year = (currentYear - i).toString();
    return {label: year, value: year};
  });
  const months = Array.from({length: 12}, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return {label: moment(month, 'MM').format('MMM'), value: month};
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const {
    image,
    fullname,
    email,
    date,
    city,
    mobileNumber,
    experience,
    aboutMe,
    address,
    docCategory,
    error,
  } = useSelector(state => state.user);

  //dropdown
  const renderLabel = () => {
    if (category || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'green'}]}>
          Doctor Category
        </Text>
      );
    }
    return null;
  };
  //

  const getCategory = async () => {
    try {
      const response = await api.get(`admin-category/view`);
      console.log('repsonse', response.data.data);
      setGetDocCategory(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchUserData());
      getCategory();
    }
  }, [isFocused]);

  useEffect(() => {
    if (docCategory) {
      setCategory(docCategory);
    }
  }, [docCategory]);

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        const imageObj = {
          uri: image.path,
          type: image.mime,
          name: 'profile.jpg',
        };

        dispatch(setField({field: 'image', value: imageObj}));
        setImageGal(imageObj);
      })
      .catch(error => {
        console.log('Image Picker Error: ', error);
      });
  };

  const showToastPic = msg => {
    Toast.show({
      type: 'success',
      text1: 'Data Updated Successfully!👍',
      text2: msg,
    });
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  // const personalDataHandler = async () => {
  //   const formData = new FormData();
  //   if (image?.uri) {
  //     formData.append('image', {
  //       uri: image.uri.startsWith('file://')
  //         ? image.uri
  //         : `file://${image.uri}`,
  //       name: image.name || 'profile.jpg',
  //       type: image.type || 'image/jpeg',
  //     });
  //   }

  //   // Append other fields to formData
  //   formData.append('status', 'Active');
  //   formData.append('fullname', fullname.trim());
  //   formData.append('email', email.toLowerCase().trim());
  //   formData.append('city', city.trim());
  //   formData.append('category', category || '');
  //   formData.append('mobileNumber', mobileNumber);
  //   formData.append('experience', experience);
  //   formData.append('date', date);
  //   formData.append('aboutMe', aboutMe);

  //   address.forEach((addr, index) => {
  //     formData.append(`address[${index}]`, addr);
  //   });

  //   try {
  //     const response = await dispatch(updateProfile(formData)).unwrap();
  //     showToastPic();
  //     console.log('AFTER API', response);
  //   } catch (error) {
  //     console.error('Update Profile Error:', error);

  //     if (error && error.response) {
  //       // Handle specific error structure
  //       const errorData = error.response.data || error.response;
  //       console.log('Error data:', errorData);

  //       Toast.show({
  //         type: 'error',
  //         text1: 'Update Failed',
  //         text2: errorData.message || 'Something went wrong.',
  //       });
  //     } else {
  //       // Handle unexpected errors
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Update Failed',
  //         text2: 'An unexpected error occurred. Please try again later.',
  //       });
  //     }
  //   }
  // };

  const personalDataHandler = async () => {
    const formData = new FormData();

    if (image?.uri) {
      formData.append('image', {
        uri: image.uri.startsWith('file://')
          ? image.uri
          : `file://${image.uri}`,
        name: image.name || 'profile.jpg',
        type: image.type || 'image/jpeg',
      });
    }

    formData.append('status', 'Active');
    formData.append('fullname', fullname?.trim() || '');
    formData.append('email', email?.toLowerCase().trim() || '');
    formData.append('city', city?.trim() || '');
    formData.append('category', category ?? '');
    formData.append('mobileNumber', mobileNumber?.toString() || '');
    formData.append('experience', experience?.toString() || '');
    formData.append('date', date?.toString() || '');
    formData.append('aboutMe', aboutMe?.toString() || '');

    // ✅ FIXED ADDRESS PART
    const cleanAddress = (address || [])
      .map(addr =>
        typeof addr === 'string' ? addr.trim() : JSON.stringify(addr),
      )
      .filter(addr => addr); // remove empty

    cleanAddress.forEach((addr, index) => {
      formData.append(`address[${index}]`, addr);
    });

    console.log('FINAL FORM DATA', formData);

    try {
      const response = await dispatch(updateProfile(formData)).unwrap();
      showToastPic();
      console.log('AFTER API', response);
    } catch (error) {
      console.error('Update Profile Error:', error);

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.response?.data?.message || 'Something went wrong.',
      });
    }
  };

  const handleAddressChange = (text, index) => {
    const newAddresses = [...address];
    newAddresses[index] = text;
    dispatch(setField({field: 'address', value: newAddresses}));
  };

  const addMoreAddress = () => {
    if (address.length < 3) {
      dispatch(setField({field: 'address', value: [...address, '']}));
    }
  };

  const removeAddress = index => {
    const newAddresses = address.filter((_, i) => i !== index);
    dispatch(setField({field: 'address', value: newAddresses}));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.innerView}>
          <Image
            style={styles.image}
            source={
              imageGal
                ? {uri: imageGal.uri}
                : require('../../assets/userLogin.png')
            }
          />

          <TouchableOpacity
            style={{justifyContent: 'flex-end', marginBottom: 10}}
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
          <Text style={globalStyles.inputHeading}>Full Name</Text>
          <Input
            placeholder={'Enter Your Full Name'}
            onChangeText={txt =>
              dispatch(setField({field: 'fullname', value: txt}))
            }
            value={fullname}
            editable={false}
          />
          <Text style={globalStyles.inputHeading}>Email</Text>
          <Input
            placeholder={'Enter Your Email'}
            autoCapitalize={'none'}
            onChangeText={txt =>
              dispatch(setField({field: 'email', value: txt}))
            }
            value={email}
            editable={false}
          />
          <Text style={globalStyles.inputHeading}>Doctor Category</Text>
          <View style={styles.container}>
            {renderLabel()}
            <Dropdown
              activeColor="rgb(126, 179, 214)"
              itemContainerStyle={{
                backgroundColor: '#fff',
              }}
              itemTextStyle={{
                color: '#333',
              }}
              style={[styles.dropdown, isFocus && {borderColor: 'green'}]}
              placeholderStyle={styles.placeholderStyle}
              searchPlaceholderTextColor="gray"
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={getDocCategory}
              search
              maxHeight={300}
              labelField="categoryName"
              valueField="categoryName"
              placeholder={!isFocus ? 'Select item' : '...'}
              searchPlaceholder="Search..."
              value={category}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setCategory(item.categoryName);
                setIsFocus(false);
              }}
            />
          </View>
          <Text style={globalStyles.inputHeading}>City</Text>
          <Input
            placeholder={'Enter City'}
            onChangeText={txt =>
              dispatch(setField({field: 'city', value: txt}))
            }
            value={city}
          />
          <Text style={globalStyles.inputHeading}>Mobile Number</Text>
          <Input
            placeholder={'Enter Your Mobile Number'}
            keyboardType={'numeric'}
            maxLength={10}
            onChangeText={txt =>
              dispatch(setField({field: 'mobileNumber', value: txt}))
            }
            value={mobileNumber?.toString() || ''}
          />
          <Text style={globalStyles.inputHeading}>Year Of Experience</Text>
          <Input
            placeholder={'How much experience You have'}
            keyboardType={'numeric'}
            onChangeText={txt =>
              dispatch(setField({field: 'experience', value: txt}))
            }
            value={experience?.toString() || ''}
          />
          <Text style={globalStyles.inputHeading}>Your DOB</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <View pointerEvents="none">
              <Input
                placeholder={'Enter Your DOB'}
                onChangeText={txt =>
                  dispatch(setField({field: 'date', value: txt}))
                }
                value={date}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          <Modal visible={isDatePickerVisible} transparent={true} animationType="fade">
            <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <View style={{backgroundColor: 'white', margin: 20, borderRadius: 10, padding: 10}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                  <Dropdown
                    style={[styles.dropdown, {flex: 1, marginRight: 5}]}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={{color: '#333'}}
                    itemContainerStyle={{ backgroundColor: '#fff' }}
                    data={months}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={calMonth}
                    onChange={item => setCalMonth(item.value)}
                  />
                  <Dropdown
                    style={[styles.dropdown, {flex: 1, marginLeft: 5}]}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={{color: '#333'}}
                    itemContainerStyle={{ backgroundColor: '#fff' }}
                    data={years}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    value={calYear}
                    onChange={item => setCalYear(item.value)}
                    search
                    searchPlaceholder="Search"
                    inputSearchStyle={styles.inputSearchStyle}
                  />
                </View>
                <Calendar
                  current={`${calYear}-${calMonth}-01`}
                  key={`${calYear}-${calMonth}`}
                  onDayPress={day => {
                    hideDatePicker();
                    const formattedDate = moment(day.dateString).format('DD/MM/YYYY');
                    dispatch(setField({field: 'date', value: formattedDate}));
                  }}
                  onMonthChange={month => {
                     setCalYear(month.year.toString());
                     setCalMonth(month.month.toString().padStart(2, '0'));
                  }}
                />
                <TouchableOpacity onPress={hideDatePicker} style={{marginTop: 10, alignItems: 'center', padding: 10}}>
                  <Text style={{color: 'red', fontWeight: 'bold', fontSize: 16}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Text style={globalStyles.inputHeading}>About Me</Text>
          <Input
            placeholder={'Enter Something About You'}
            onChangeText={txt =>
              dispatch(setField({field: 'aboutMe', value: txt}))
            }
            value={aboutMe}
          />
          <Text style={globalStyles.inputHeading}>Address</Text>
          {address.map((addr, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Input
                placeholder={'Enter Your Address'}
                onChangeText={txt => handleAddressChange(txt, index)}
                value={addr}
              />
              {address.length > 1 && index > 0 && (
                <TouchableOpacity
                  onPress={() => removeAddress(index)}
                  style={{marginLeft: 10}}>
                  <Text style={{color: 'red'}}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {address.length < 3 && (
            <TouchableOpacity onPress={addMoreAddress} style={{marginTop: 10}}>
              <Text style={{color: 'blue'}}>Add More Address</Text>
            </TouchableOpacity>
          )}
          {error ? (
            <Text style={{color: 'red', alignSelf: 'flex-end'}}>{error}</Text>
          ) : null}
        </View>
      </ScrollView>
      <View style={{alignSelf: 'flex-end', marginVertical: 10}}>
        <NextButton onPress={personalDataHandler} label={'SUBMIT'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 10,
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
  dropdown: {
    height: 50,
    borderColor: 'gray',
    color: '#000',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'gray',
  },
});
