import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import BASE_URL from '../utils/baseUrl';
import {colorGlobal} from '../utils/GlobalStyles';

export default function Header({
  nameOfDr,
  userImage,
  notificationOnPress,
  city,
  available,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          style={styles.image}
          source={{uri: `${BASE_URL}/Images/${userImage}`}}
          resizeMode="cover"
        />
        <View>
          <View style={styles.textView}>
            <Text style={styles.textHello}>Hello{', '}</Text>
            <Text style={styles.nameText}>{nameOfDr}</Text>
          </View>
          <View style={styles.cityView}>
            <Text style={styles.cityText}>{city}</Text>
            <Text
              style={[
                styles.availableText,
                {
                  color:
                    available === 'online'
                      ? 'green'
                      : available === 'offline'
                      ? 'red'
                      : available === 'busy'
                      ? 'orange'
                      : '#000',
                },
              ]}>
              {available}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={notificationOnPress}>
        <MaterialIcons
          name="notifications"
          size={28}
          color={colorGlobal.themeColor}
        />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 70,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 3,
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30,
    resizeMode: 'contain',
  },
  textView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 20,
  },
  textHello: {
    color: colorGlobal.themeColor,
    fontSize: scale(16),
    textAlign: 'center',
    fontWeight: '800',
  },
  nameText: {
    color: colorGlobal.themeColor,
    textAlign: 'center',
    fontSize: scale(14),
    fontWeight: '600',
  },
  cityView: {flexDirection: 'row', alignItems: 'center'},
  cityText: {
    marginLeft: 20,
    fontSize: scale(13),
    fontWeight: '500',
    color: colorGlobal.black,
  },
  availableText: {
    marginLeft: 10,
    fontSize: scale(12),
  },
  bellImage: {width: 30, height: 30},
});
