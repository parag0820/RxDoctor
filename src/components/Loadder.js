import {View, ActivityIndicator} from 'react-native';
import React from 'react';

export default function Loader({size, color, animating}) {
  return (
    <View>
      <ActivityIndicator size={size} color={color} animating={animating} />
    </View>
  );
}
