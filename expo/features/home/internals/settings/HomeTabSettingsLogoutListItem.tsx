import { useLogout } from '@hpapp/features/auth';
import { Text } from '@hpapp/features/common';
import { t } from '@hpapp/system/i18n';
import { ListItem } from '@rneui/themed';

export default function HomeTabSettingsLogoutListItem() {
  const logout = useLogout();
  return (
    <ListItem onPress={logout}>
      <ListItem.Title>
        <Text>{t('Logout')}</Text>
      </ListItem.Title>
    </ListItem>
  );
}
