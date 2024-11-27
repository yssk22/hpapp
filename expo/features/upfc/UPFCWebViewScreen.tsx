import { useUPFCConfig } from '@hpapp/features/app/settings';
import { useThemeColor } from '@hpapp/features/app/theme';
import { Spacing } from '@hpapp/features/common/constants';
import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { Button, Icon } from '@rneui/themed';
import { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { UPFCSite } from './scraper';

export type UPFCWebViewScreenProps = {
  site: UPFCSite;
  urlParams?: string;
};

export default defineScreen('/upfc/wv/', function UPFCWebViewScreen({ site, urlParams }: UPFCWebViewScreenProps) {
  useScreenTitle('upfc.jp');
  const insets = useSafeAreaInsets();
  const [color, contrastColor] = useThemeColor('secondary');
  const webview = useRef<WebView>(null);
  const config = useUPFCConfig();
  const username = site === 'helloproject' ? config?.hpUsername : config?.mlUsername;
  const password = site === 'helloproject' ? config?.hpPassword : config?.mlPassword;
  const uri = urlParams
    ? `https://www.upfc.jp/${site}/login.php?${urlParams}`
    : `https://www.upfc.jp/${site}/login.php`;
  const onLoadEnd = useCallback(() => {
    webview?.current?.injectJavaScript(`(function(){
        if(document.getElementById('Member_No') !== null){
          document.getElementById('Member_No').value=${JSON.stringify(username)}
          document.getElementById('Member_Password').value=${JSON.stringify(password)}
          document.getElementById('CheckboxAgree').checked=true;    
          document.getElementById('Submit').disabled=false;    
        };
      })();
      `);
  }, [username, password, webview]);
  return (
    <>
      <View style={styles.webviewConainer}>
        <WebView style={styles.webviewMain} ref={webview} source={{ uri }} onLoadEnd={onLoadEnd} />
        <View style={[styles.webviewFooter, { paddingBottom: insets.bottom, backgroundColor: contrastColor }]}>
          <Button
            type="clear"
            containerStyle={styles.webviewFooterButton}
            icon={<Icon name="caretleft" type="antdesign" color={color} />}
            onPress={() => webview?.current?.goBack()}
          />
          <Button
            type="clear"
            containerStyle={styles.webviewFooterButton}
            icon={<Icon name="caretright" type="antdesign" color={color} />}
            onPress={() => webview?.current?.goForward()}
          />
          <Button
            type="clear"
            containerStyle={styles.webviewFooterButton}
            icon={<Icon name="reload1" type="antdesign" color={color} />}
            onPress={() => webview?.current?.reload()}
          />
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  webviewConainer: {
    flex: 1
  },
  webviewMain: {
    flex: 1
  },
  webviewFooter: {
    flexDirection: 'row',
    paddingTop: Spacing.XSmall
  },
  webviewFooterButton: {
    flexGrow: 1
  }
});
