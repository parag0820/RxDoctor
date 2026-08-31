// Rating.js
import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Rating = ({value, maxStars = 5}) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <Icon
        key={i}
        name="star"
        size={24}
        color={i <= value ? 'orange' : 'gray'}
      />,
    );
  }

  return (
    <View
      style={{flexDirection: 'row', alignSelf: 'center', marginVertical: 10}}>
      {stars}
    </View>
  );
};

export default Rating;
