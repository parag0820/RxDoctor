import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colorGlobal } from '../utils/globalStyls';

export default function PrimaryButton({ label, onPress, color }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.labelText}>{label}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    borderRadius: 30,
    marginTop: 30,
    backgroundColor: colorGlobal.themeColor,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  labelText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
  },
});
