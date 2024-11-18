import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  webviewConainer: {
    flex: 1
  }
});

export type UPFCWebViewScreenProps = {
  login?: boolean;
  uri: string;
};

export default defineScreen(
  '/elineupmall/wv/',
  function ElineupMallWebView({ login = false, uri }: UPFCWebViewScreenProps) {
    useScreenTitle('Elineup Mall');
    const webview = useRef<WebView>(null);
    return (
      <>
        <View style={styles.webviewConainer}>
          <WebView ref={webview} source={{ uri }} />
        </View>
      </>
    );
  }
);
