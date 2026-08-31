import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/screens/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AuthProvider>
          <StatusBar barStyle="dark-content" backgroundColor="white" translucent={false} />
          <SafeAreaView style={{flex: 1, backgroundColor: 'white'}} edges={['bottom']}>
            <RootNavigator />
            <Toast />
          </SafeAreaView>
        </AuthProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
