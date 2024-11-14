import { useThemeColor } from '@hpapp/features/app/theme';
import { FontSize } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Header, Button } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import useAssetContent from './useAssetContent';

export default function ConsentGate({
  title,
  moduleId,
  pass,
  showHeader,
  children,
  onConsent
}: {
  title: string;
  moduleId: number;
  pass: boolean;
  showHeader?: boolean;
  children: React.ReactNode;
  onConsent: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [, contrastColor] = useThemeColor('primary');
  const [content, isLoading] = useAssetContent(moduleId);
  if (pass) {
    return <>{children}</>;
  }
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      {showHeader && (
        <Header
          placement="center"
          centerComponent={{
            text: title,
            style: {
              fontSize: FontSize.Large,
              fontWeight: 'bold',
              color: contrastColor
            }
          }}
        />
      )}
      <>
        <WebView source={{ html: content }} />
        <Button title={t('I agree')} onPress={onConsent} loading={isLoading} disabled={isLoading} />
      </>
    </View>
  );
}
