import { useNavigation } from '@hpapp/features/common/stack';
import UPFCWebViewScreen, { UPFCWebViewScreenProps } from '@hpapp/features/upfc/UPFCWebViewScreen';
import { logEvent } from '@hpapp/system/firebase';
import { useCallback } from 'react';

export default function useUPFCWebView() {
  const navigation = useNavigation();
  const openUPFCWeView = useCallback(
    (params?: UPFCWebViewScreenProps) => {
      logEvent('upfc_open_webview', {
        feature: 'upfc',
        ...params
      });
      navigation.push(UPFCWebViewScreen, params);
    },
    [navigation]
  );
  return openUPFCWeView;
}
