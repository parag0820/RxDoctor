import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colorGlobal} from '../utils/GlobalStyles';

export default function SearchBar({
  placeholder,
  onChangeText,
  value,
  onPress,
  ref,
}) {
  let image = require('../assets/clear.png');

  return (
    <View style={styles.root}>
      <View style={styles.innerView}>
        <Image source={require('../assets/search.png')} style={styles.image} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          ref={ref}
          onChangeText={onChangeText}
          placeholderTextColor={'#cccccc'}
          value={value}
        />
      </View>
      <TouchableOpacity onPress={onPress} style={styles.imageSqare}>
        <Image style={styles.imageSqare} source={image} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    width: '90%',
    height: 50,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    paddingLeft: 10,
    color: '#000000',
  },
  image: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginLeft: 10,
    color: colorGlobal.white,
  },
  innerView: {
    flexDirection: 'row',
  },
  imageSqare: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginRight: 10,
  },
});
