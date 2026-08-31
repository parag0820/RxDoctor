import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

export default function RegisterButton({label, onPress, color, disabled}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, {backgroundColor: color}]}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    borderRadius: 30,
    marginVertical: 10,
    backgroundColor: '#4169E1',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
  },
});
