import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import GlobalStyles, {colorGlobal} from '../utils/GlobalStyles';

export default function SystemHeader({label, onPress}) {
  return (
    <View style={styles.container}>
      <View style={styles.innerView}>
        <Text style={styles.headingText}>{label}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={[styles.headingText, {color: '#000'}]}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  innerView: {
    backgroundColor: colorGlobal.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 7,
    elevation: 2,
  },

  headingText: {
    padding: 5,
    fontSize: 18,
    fontWeight: '600',
    color: colorGlobal.black,
  },
});
