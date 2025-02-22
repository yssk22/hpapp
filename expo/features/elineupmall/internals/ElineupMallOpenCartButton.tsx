import { useThemeColor } from '@hpapp/features/app/theme';
import { Spacing } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import ElineupMallWebViewScreen from '@hpapp/features/elineupmall/ElineupMallWebViewScreen';
import { logEvent } from '@hpapp/system/firebase';
import CookieManager from '@react-native-cookies/cookies';
import { Button, Icon } from '@rneui/themed';
import { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';

import { useElineupMall } from './ElineupMallProvider';
import ElineupMallStatusIcon from './ElineupMallStatusIcon';

export default function ElineupMallOpenCartButton() {
  const elineupmall = useElineupMall();
  const navigation = useNavigation();
  const [secondary] = useThemeColor('secondary');
  const numberOfItems = elineupmall.cart?.size ?? 0;
  const text = `(${numberOfItems})`;
  const onPress = useCallback(() => {
    // clean the cookie.
    // TODO: clear cookies only for elineupmall.com
    CookieManager.clearAll();
    switch (elineupmall.status) {
      case 'error_not_opted_in':
        break;
      case 'error_upfc_is_empty':
        break;
      case 'error_unknown':
        Alert.alert('e-Lineup!Mall', 'error_unknown');
        break;
      case 'error_authenticate':
        Alert.alert('e-Lineup!Mall', 'error_authenticate');
        break;
      case 'ready':
        logEvent('elineupmall_open_webview', {
          feature: 'elineupmall',
          uri: numberOfItems > 0 ? 'https://www.elineupmall.com/cart/' : 'https://www.elineupmall.com/',
          login: true
        });
        navigation.push(ElineupMallWebViewScreen, {
          uri: numberOfItems > 0 ? 'https://www.elineupmall.com/cart/' : 'https://www.elineupmall.com/',
          login: true
        });
    }
  }, [numberOfItems, elineupmall.status]);
  return (
    <Button
      type="outline"
      size="sm"
      color="secondary"
      containerStyle={styles.button}
      icon={
        <View style={styles.icon}>
          <ElineupMallStatusIcon />
        </View>
      }
      onPress={onPress}
    >
      e-Lineup!Mall
      <Icon name="shopping-cart" type="fontawesome" color={secondary} />
      {numberOfItems > 0 && text}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: Spacing.XSmall
  },
  icon: {
    marginRight: Spacing.XSmall
  }
});
