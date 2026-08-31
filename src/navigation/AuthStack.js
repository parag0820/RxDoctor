// src/navigation/AuthStack.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import your auth screens
import Login from '../screens/auth/Login';
import SignUp from '../screens/auth/SignUp';
import ForgotPassword from '../screens/auth/ForgotPassword';
import Verification from '../screens/auth/Verification';
import ResetPass from '../screens/auth/ResetPass';
import TermsConditions from '../screens/app/TermsConditions';
import ChangePassword from '../screens/app/ChangePassword';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPass" component={ResetPass} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen
        name="TermsConditions"
        component={TermsConditions}
        options={{title: 'Terms & Conditions', headerShown: true}}
      />
    </Stack.Navigator>
  );
}
