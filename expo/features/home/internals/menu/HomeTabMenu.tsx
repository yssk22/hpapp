import { useThemeColor } from '@hpapp/features/app/theme';
import { AuthGateByRole } from '@hpapp/features/auth';
import { Text } from '@hpapp/features/common';
import { NavigationListItem } from '@hpapp/features/common/list';
import ContentScreen from '@hpapp/features/content/ContentScreen';
import HPSortScreen from '@hpapp/features/hpsort/HPSortScreen';
import SettingsDevOnlyScreen from '@hpapp/features/settings/SettingsDevOnlyScreen';
import ThemeSettingsScreen from '@hpapp/features/settings/SettingsThemeScreen';
import UPFCHistoryScreen from '@hpapp/features/upfc/UPFCHistoryScreen';
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
      <NavigationListItem screen={UPFCHistoryScreen}>{t('Event History')}</NavigationListItem>
      <ListItem containerStyle={{ backgroundColor: sectionColor }}>
        <ListItem.Title>
          <Text style={{ color: sectionColorContrast, fontWeight: 'bold' }}>{t('Policies')}</Text>
        </ListItem.Title>
      </ListItem>
      <NavigationListItem
        screen={ContentScreen}
        params={{
          title: t('Terms of Service'),
          moduleId: require('assets/policy/tos.html')
        }}
      >
        {t('Terms of Service')}
      </NavigationListItem>
      <NavigationListItem
        screen={ContentScreen}
        params={{
          title: t('Privacy Policy'),
          moduleId: require('assets/policy/privacy.html')
        }}
      >
        {t('Privacy Policy')}
      </NavigationListItem>
      <NavigationListItem
        screen={ContentScreen}
        params={{
          title: t('FC Data Policy'),
          moduleId: require('assets/policy/fcdata.html')
        }}
      >
        {t('FC Data Policy')}
      </NavigationListItem>
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
      <ListItem containerStyle={{ backgroundColor: sectionColor }}>
        <Text style={{ color: sectionColorContrast, fontWeight: 'bold' }}>{t('Other')}</Text>
      </ListItem>
      <HomeTabSettingsLogoutListItem />
      <ListItem containerStyle={{ backgroundColor: sectionColor }} />
      <Divider />
      <HomeTabSettingsVersionSignature />
    </ScrollView>
  );
}
