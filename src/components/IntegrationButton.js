import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {colorGlobal} from '../utils/globalStyls';
import {scale} from 'react-native-size-matters';

export default function IntegrationButton({image, onPress, label}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {image ? image : null}
      <Text style={styles.title}>{label}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    width: `100%`,
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: colorGlobal.themeColor,
    marginVertical: scale(20),
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});
