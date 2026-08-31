import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';
import {colorGlobal} from '../../utils/globalStyls';

export default function HelpCenter() {
  return (
    <View style={styles.container}>
      <View style={styles.innerView}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.text}>FAQ</Text>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#ccc',
              marginVertical: scale(5),
            }}></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.text}>Contact Us</Text>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#ccc',
              marginVertical: scale(5),
            }}></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.text}>terms & Conditions</Text>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#ccc',
              marginVertical: scale(5),
            }}></View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorGlobal.white,
    alignItems: 'center',
  },
  innerView: {
    width: '90%',
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    backgroundColor: colorGlobal.lightSeaGreen,
    paddingVertical: scale(10),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colorGlobal.seaGreen,
  },
  text: {
    color: colorGlobal.black,
    fontSize: scale(14),
    fontWeight: '700',
    paddingVertical: 10,
  },
});
