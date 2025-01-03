import { useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import { FontSize } from '@hpapp/features/common/constants';
import { ListItem, ListItemSwitch } from '@hpapp/features/common/list';
import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { Divider } from '@rneui/themed';
import { ScrollView, StyleSheet, Text } from 'react-native';

import ElineupMallSettingsFollowings from './internal/settings/ElineupMallSettingsFollowings';

export default defineScreen('/elineupmall/settings/', function ElineupMallSettingsScreen() {
  useScreenTitle(t('Elineup Mall Settings'));
  const config = useUserConfig();
  const updator = useUserConfigUpdator();
  return (
    <ScrollView>
      <ListItemSwitch
        label={
          <>
            <Text>{t('Fetch Elnieup Mall Purchase History')}</Text>
            <Text style={styles.sublabel}>
              {t('FC credentials will be used to fetch your purchase history from elineupmall.')}
            </Text>
          </>
        }
        value={config?.elineupmallFetchPurchaseHistory ?? false}
        onValueChange={(value) => {
          updator({
            ...config!,
            elineupmallFetchPurchaseHistory: value
          });
        }}
      />
      <Divider />
      <ListItem>
        <Text>{t('Following settings per a member per a category')}</Text>
      </ListItem>
      <ElineupMallSettingsFollowings />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  sublabel: {
    fontSize: FontSize.Small
  }
});
