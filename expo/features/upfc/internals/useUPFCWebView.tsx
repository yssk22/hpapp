import { useNavigation } from '@hpapp/features/common/stack';
import UPFCWebViewScreen from '@hpapp/features/upfc/UPFCWebViewScreen';
import { useCallback } from 'react';

export default function useUPFCWebView() {
  const navigation = useNavigation();
  const openUPFCWeView = useCallback(
    (params?: { urlParams?: string }) => {
      navigation.push(UPFCWebViewScreen, params);
    },
    [navigation]
  );
  return openUPFCWeView;
}
