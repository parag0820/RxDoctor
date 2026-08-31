import React from 'react';
import {View, Text, Button} from 'react-native';

export default function Settings({navigation}) {
  return (
    <View>
      <Text>Settings Screen</Text>

      <Button title="Logout" onPress={() => navigation.navigate('Logout')} />
    </View>
  );
}
