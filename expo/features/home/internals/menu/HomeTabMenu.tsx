import AccountScreen from '@hpapp/features/account/AccountScreen';
import { ListItemSectionHeader, NavigationListItem } from '@hpapp/features/common/list';
import ContentScreen from '@hpapp/features/content/ContentScreen';
import DevtoolScreen from '@hpapp/features/devtool/DevtoolScreen';
import HPSortScreen from '@hpapp/features/hpsort/HPSortScreen';
import PushNotificationSettingsScreen from '@hpapp/features/push/PushNotiicationSettingsScreen';
import ThemeScreen from '@hpapp/features/theme/ThemeScreen';
import UPFCHistoryScreen from '@hpapp/features/upfc/UPFCHistoryScreen';
import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';
import { t } from '@hpapp/system/i18n';
import { Divider } from '@rneui/themed';
import { ScrollView } from 'react-native';

import HomeTabSettingsLogoutListItem from './HomeTabMenuLogoutListItem';
import HomeTabSettingsVersionSignature from './HomeTabMenuVersionSignature';

export default function HomeTabMenu() {
  return (
    <ScrollView>
      <NavigationListItem screen={HPSortScreen}>{t('Sort History')}</NavigationListItem>
      <Divider />
      <NavigationListItem screen={UPFCHistoryScreen}>{t('Event History')}</NavigationListItem>
      <Divider />
      <ListItemSectionHeader label={t('Settings')} />
      <NavigationListItem screen={ThemeScreen}>{t('Theme Settings')}</NavigationListItem>
      <Divider />
      <NavigationListItem screen={UPFCSettingsScreen}>{t('FC Settings')}</NavigationListItem>
      <Divider />
      <NavigationListItem screen={PushNotificationSettingsScreen}>{t('Push Notification Settings')}</NavigationListItem>
      <Divider />
      <NavigationListItem screen={AccountScreen}>{t('Account')}</NavigationListItem>
      <Divider />
      <NavigationListItem screen={DevtoolScreen}>{t('Developer Settings')}</NavigationListItem>
      <Divider />
      <ListItemSectionHeader label={t('Policies')} />
      <NavigationListItem
        screen={ContentScreen}
        params={{
          title: t('Terms of Service'),
          moduleId: require('assets/policy/tos.html')
        }}
      >
        {t('Terms of Service')}
      </NavigationListItem>
      <Divider />
      <NavigationListItem
        screen={ContentScreen}
        params={{
          title: t('Privacy Policy'),
          moduleId: require('assets/policy/privacy.html')
        }}
      >
        {t('Privacy Policy')}
      </NavigationListItem>
      <Divider />
      <NavigationListItem
        screen={ContentScreen}
        params={{
          title: t('FC Data Policy'),
          moduleId: require('assets/policy/fcdata.html')
        }}
      >
        {t('FC Data Policy')}
      </NavigationListItem>
      <ListItemSectionHeader label={t('Other')} />
      <HomeTabSettingsLogoutListItem />
      <Divider />
      <HomeTabSettingsVersionSignature />
    </ScrollView>
  );
}
