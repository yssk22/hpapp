import { useUPFCConfig } from '@hpapp/features/app/settings';
import { useThemeColor } from '@hpapp/features/app/theme';
import { Spacing } from '@hpapp/features/common/constants';
import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { Button, Icon } from '@rneui/themed';
import { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export type UPFCWebViewScreenProps = {
  login?: boolean;
  uri: string;
};

export default defineScreen(
  '/elineupmall/wv/',
  function ElineupMallWebView({ login = false, uri }: UPFCWebViewScreenProps) {
    useScreenTitle('Elineup Mall');
    const insets = useSafeAreaInsets();
    const [color, contrastColor] = useThemeColor('secondary');
    const webview = useRef<WebView>(null);
    const config = useUPFCConfig();
    const username = config?.hpUsername ?? '';
    const password = config?.hpPassword ?? '';
    const onLoadEnd = useCallback(() => {
      webview?.current?.injectJavaScript(`(function(){
        document.querySelector('#account_info_3 .ty-account-info__buttons a.ty-btn.ty-btn__secondary').click()
        document.querySelectorAll('input[name="user_login"]').forEach((elem)=> {elem.value=${JSON.stringify(username)}});
        document.querySelectorAll('input[name="password"]').forEach((elem)=> {elem.value=${JSON.stringify(password)}});
      })();
`);
    }, [uri, username, password, webview]);

    return (
      <>
        <View style={styles.webviewConainer}>
          <WebView ref={webview} source={{ uri }} onLoadEnd={onLoadEnd} />
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
  }
);

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
