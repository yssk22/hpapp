import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import * as Updates from 'expo-updates';
import { ErrorInfo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppGlobalErrorFallback({ error, errorInfo }: { error: Error; errorInfo: ErrorInfo }) {
  const [color] = useThemeColor('error');
  const insets = useSafeAreaInsets();
  const hintText = getHintText(error);
  return (
    <ScrollView>
      <View style={[styles.container, { marginTop: insets.top, marginBottom: insets.bottom }]}>
        <Text style={styles.title}>{t('Unexpected error occurred.')}</Text>
        <Text style={[styles.message, { color }]}>{error.message}</Text>
        <Text style={styles.notice}>
          {hintText}
          {t('Please try to reinstall the app if you continue to see this error.')}
        </Text>
        <Text style={styles.stack}>{errorInfo.componentStack}</Text>
        <Button
          containerStyle={styles.button}
          onPress={() => {
            Updates.reloadAsync();
          }}
        >
          {t('Restart')}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: FontSize.Large,
    fontWeight: 'bold',
    marginTop: Spacing.XXLarge
  },
  message: {
    fontSize: FontSize.Medium,
    fontWeight: 'bold'
  },
  stack: {
    fontSize: FontSize.XSmall,
    marginBottom: Spacing.XXLarge
  },
  notice: {
    fontSize: FontSize.Medium,
    marginTop: Spacing.Medium,
    marginBottom: Spacing.Medium,
    marginLeft: Spacing.XLarge,
    marginRight: Spacing.XLarge
  },
  button: {
    marginTop: Spacing.Medium,
    width: '50%'
  }
});

function getHintText(err: Error): string | undefined {
  if (err.message.includes('Unexpected HTTP status error')) {
    return t('Please confirm your network connection and restart the app.');
  }
  if (err.message === 'timeout') {
    return t('Please confirm your network connection and restart the app.');
  }
  return err.message;
}
