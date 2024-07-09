import { AuthGateByRole } from '@hpapp/features/auth';
import { NavigationListItem } from '@hpapp/features/common/list';
import SettingsDevOnlyScreen from '@hpapp/features/settings/SettingsDevOnlyScreen';
import ThemeSettingsScreen from '@hpapp/features/settings/SettingsThemeScreen';
import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';
import { t } from '@hpapp/system/i18n';
import { Divider } from '@rneui/themed';
import { ScrollView } from 'react-native';

import HomeTabSettingsLogoutListItem from './HomeTabSettingsLogoutListItem';
import HomeTabSettingsVersionSignature from './HomeTabSettingsVersionSignature';

export default function HomeTabSettings() {
  return (
    <ScrollView>
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
