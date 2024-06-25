import { defineScreen, useScreenTitle } from '@hpapp/features/root/protected/stack';
import useUPFCSettings from '@hpapp/features/upfc/settings/useUPFCSettings';
import { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  webviewConainer: {
    flex: 1
  }
});

type UPFCWebViewScreenProps = {
  urlParams?: string;
};

export default defineScreen('/upfc/wv/', function UPFCWebViewScreen({ urlParams }: UPFCWebViewScreenProps) {
  useScreenTitle('up-fc.jp');
  const webview = useRef<WebView>(null);
  const [config] = useUPFCSettings();
  const username = config?.username;
  const password = config?.password;
  const uri = urlParams
    ? `https://www.up-fc.jp/helloproject/fanclub_Login.php?${urlParams}`
    : 'https://www.up-fc.jp/helloproject/fanclub_Login.php';
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
