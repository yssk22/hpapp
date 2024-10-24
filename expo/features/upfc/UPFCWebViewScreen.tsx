import { useUPFCConfig } from '@hpapp/features/app/settings';
import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { UPFCSite } from './scraper';

const styles = StyleSheet.create({
  webviewConainer: {
    flex: 1
  }
});

export type UPFCWebViewScreenProps = {
  site: UPFCSite;
  urlParams?: string;
};

export default defineScreen('/upfc/wv/', function UPFCWebViewScreen({ site, urlParams }: UPFCWebViewScreenProps) {
  useScreenTitle('up-fc.jp');
  const webview = useRef<WebView>(null);
  const config = useUPFCConfig();
  const username = site === 'helloproject' ? config?.hpUsername : config?.mlUsername;
  const password = site === 'helloproject' ? config?.hpPassword : config?.mlPassword;
  const uri = urlParams
    ? `https://www.up-fc.jp/${site}/fanclub_Login.php?${urlParams}`
    : `https://www.up-fc.jp/${site}/fanclub_Login.php`;
  const onLoadEnd = useCallback(() => {
    webview?.current?.injectJavaScript(`(function(){
        if(document.getElementsByName('User_No').length > 0){
          document.getElementsByName('User_No')[0].value=${JSON.stringify(username)}
          document.getElementsByName('User_LoginPassword')[0].value=${JSON.stringify(password)}
          document.getElementsByName('pp')[0].checked=true;    
        };
      })();
      `);
  }, [username, password, webview]);
  return (
    <>
      <View style={styles.webviewConainer}>
        <WebView ref={webview} source={{ uri }} onLoadEnd={onLoadEnd} />
      </View>
    </>
  );
});
