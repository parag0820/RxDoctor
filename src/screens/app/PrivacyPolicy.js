import {WebView} from 'react-native-webview';
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

export default function PrivacyPolicy() {
  const url = 'https://www.rxchartsquare.com/privacy-policy.html';

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: url}}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loader} />
        )}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
