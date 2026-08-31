import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainTabs from './BottomTabs.js';
import Login from '../screens/auth/Login.js';
import SignUp from '../screens/auth/SignUp.js';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}
