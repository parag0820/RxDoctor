import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import React from 'react';
import {scale} from 'react-native-size-matters';

export default function ForgetComponent({
  image,
  title,
  mediam,
  bcolor,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, {borderColor: bcolor}]}>
      <View>
        <Image source={image} style={styles.image} />
      </View>
      <View style={styles.textView}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{mediam}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 100,
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: 'gray',
    marginTop: 20,
  },
  image: {
    marginLeft: scale(20),
    height: 30,
    width: 30,
  },
  textView: {
    marginLeft: scale(20),
  },
  title: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
});
