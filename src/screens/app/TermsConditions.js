import {WebView} from 'react-native-webview';
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

export default function TermsConditions() {
  const url = 'https://www.rxchartsquare.com/terms.html';

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
