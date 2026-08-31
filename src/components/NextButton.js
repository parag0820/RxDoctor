import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colorGlobal} from '../utils/globalStyls';
import {scale} from 'react-native-size-matters';

export default function NextButton({onPress, label}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: colorGlobal.themeColor,
    // paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: scale(14),
    color: colorGlobal.white,
    textAlign: 'center',
  },
});
