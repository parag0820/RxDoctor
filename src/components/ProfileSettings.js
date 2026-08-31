import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {colorGlobal} from '../utils/globalStyls';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export default function ProfileSettings({
  label,
  onPress,
  logo,
  image,
  mode,
  color,
}) {
  const [value, setValue] = useState('online'); // default value set to 'online'
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    {label: 'Online', value: 'online'},
    {label: 'Offline', value: 'offline'},
    {label: 'Busy', value: 'busy'},
  ];

  const availableHandler = async newValue => {
    const change = {available: newValue};
    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await api.put(
        `doctorPanel/doctor-edit/${userId}`,
        change,
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View onPress={onPress} style={styles.container}>
      <View style={styles.imageView}>
        <Image style={[styles.image, {tintColor: color}]} source={logo} />
        <Text style={[styles.settingText]}>{label}</Text>
      </View>
      {mode ? (
        <View style={{}}>
          <Dropdown
            style={[styles.dropdown, isFocus && {borderColor: 'green'}]}
            selectedTextStyle={{
              color:
                value === 'online'
                  ? 'green'
                  : value === 'offline'
                  ? 'red'
                  : value === 'busy'
                  ? 'orange'
                  : '#000',
            }}
            itemTextStyle={{color: colorGlobal.black}}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            iconColor="black"
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              availableHandler(item.value); // call handler when value changes
              setIsFocus(false);
            }}
          />
        </View>
      ) : null}
      {image ? <Image style={styles.image} source={image} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  imageView: {flexDirection: 'row'},
  image: {width: 20, height: 20, tintColor: colorGlobal.gray},
  settingText: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: '800',
    color: colorGlobal.black,
  },
  arrow: {
    width: 24,
    height: 24,
  },
  dropdown: {
    height: 50,
    width: 100,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
