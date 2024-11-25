import { useThemeColor } from '@hpapp/features/app/theme';
import { t } from '@hpapp/system/i18n';
import { ListItem, Text } from '@rneui/themed';
import { Linking } from 'react-native';

export default function PushNotificationPermissionErrorBanner() {
  const [color, contrastColor] = useThemeColor('warning');
  return (
    <ListItem containerStyle={{ backgroundColor: color }} onPress={() => Linking.openSettings()}>
      <ListItem.Content>
        <Text style={{ color: contrastColor }}>
          {[t('Push Notification is disabled by settings.'), t('Tap to configure it.')].join(' ')}
        </Text>
      </ListItem.Content>
    </ListItem>
  );
}
