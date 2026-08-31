import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colorGlobal} from '../utils/globalStyls';
import {scale, verticalScale} from 'react-native-size-matters';
export default function AddButton({title, onPress, color}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, {backgroundColor: color}]}>
      <Text style={[styles.button]}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 40,
    marginLeft: 10,
    backgroundColor: colorGlobal.themeColor,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    color: '#fff',
    fontWeight: '500',
    fontSize: scale(16),
  },
});
