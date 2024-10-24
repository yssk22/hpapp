import { useNavigation } from '@hpapp/features/common/stack';
import UPFCWebViewScreen, { UPFCWebViewScreenProps } from '@hpapp/features/upfc/UPFCWebViewScreen';
import { useCallback } from 'react';

export default function useUPFCWebView() {
  const navigation = useNavigation();
  const openUPFCWeView = useCallback(
    (params?: UPFCWebViewScreenProps) => {
      navigation.push(UPFCWebViewScreen, params);
    },
    [navigation]
  );
  return openUPFCWeView;
}
