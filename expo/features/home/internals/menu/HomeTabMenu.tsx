import { useThemeColor } from '@hpapp/features/app/theme';
import { AuthGateByRole } from '@hpapp/features/auth';
import { Text } from '@hpapp/features/common';
import { NavigationListItem } from '@hpapp/features/common/list';
import HPSortScreen from '@hpapp/features/hpsort/HPSortScreen';
import SettingsDevOnlyScreen from '@hpapp/features/settings/SettingsDevOnlyScreen';
import ThemeSettingsScreen from '@hpapp/features/settings/SettingsThemeScreen';
import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';
import { t } from '@hpapp/system/i18n';
import { Divider, ListItem } from '@rneui/themed';
import { ScrollView } from 'react-native';

import HomeTabSettingsLogoutListItem from './HomeTabMenuLogoutListItem';
import HomeTabSettingsVersionSignature from './HomeTabMenuVersionSignature';

export default function HomeTabSettings() {
  const [sectionColor, sectionColorContrast] = useThemeColor('disabled');

  return (
    <ScrollView>
      <NavigationListItem screen={HPSortScreen}>{t('Sort')}</NavigationListItem>
      <ListItem containerStyle={{ backgroundColor: sectionColor }}>
        <ListItem.Title>
          <Text style={{ color: sectionColorContrast, fontWeight: 'bold' }}>{t('Settings')}</Text>
        </ListItem.Title>
      </ListItem>
      <NavigationListItem screen={ThemeSettingsScreen}>{t('Theme Settings')}</NavigationListItem>
      <Divider />
      <NavigationListItem screen={UPFCSettingsScreen}>{t('FC Settings')}</NavigationListItem>
      <AuthGateByRole allow="admin">
        <Divider />
        <NavigationListItem screen={SettingsDevOnlyScreen}>{t('Dev Only Settings')}</NavigationListItem>
      </AuthGateByRole>
      <Divider />
      <HomeTabSettingsLogoutListItem />
      <Divider />
      <HomeTabSettingsVersionSignature />
    </ScrollView>
  );
}
