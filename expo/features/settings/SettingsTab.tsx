import { TierGate } from '@hpapp/features/auth';
import NavigationListItem from '@hpapp/features/common/components/list/NavigationListItem';
import LogoutListItem from '@hpapp/features/settings/LogoutListItem';
import VersionSignature from '@hpapp/features/settings/VersionSignature';
import DevOnlySettingsScreen from '@hpapp/features/settings/devonly/DevOnlySettingsScreen';
import ThemeSettingsScreen from '@hpapp/features/settings/theme/ThemeSettingsScreen';
import UPFCSettingsScreen from '@hpapp/features/upfc/components/UPFCSettingsScreen';
import { t } from '@hpapp/system/i18n';
import { Divider } from '@rneui/themed';
import { ScrollView } from 'react-native';

export default function SettingsTab() {
  return (
    <ScrollView>
      <NavigationListItem screen={ThemeSettingsScreen}>{t('Theme Settings')}</NavigationListItem>
      <Divider />
      <NavigationListItem screen={UPFCSettingsScreen}>{t('FC Settings')}</NavigationListItem>
      <TierGate allow="admin">
        <Divider />
        <NavigationListItem screen={DevOnlySettingsScreen}>{t('Dev Only Settings')}</NavigationListItem>
      </TierGate>
      <Divider />
      <LogoutListItem />
      <Divider />
      <VersionSignature />
    </ScrollView>
  );
}
