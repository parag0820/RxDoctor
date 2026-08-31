import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {AuthContext} from '../screens/context/AuthContext';
import {ActivityIndicator, View} from 'react-native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function RootNavigator() {
  const {userToken, loading} = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
