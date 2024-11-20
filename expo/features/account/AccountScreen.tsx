import { useCurrentUser } from '@hpapp/features/app/settings';
import { useUserRoles } from '@hpapp/features/auth';
import { Spacing } from '@hpapp/features/common/constants';
import { ListItemKeyValue } from '@hpapp/features/common/list';
import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { t } from '@hpapp/system/i18n';
import { Divider } from '@rneui/base';
import { ScrollView, StyleSheet, View } from 'react-native';

import AccountDeletionButton from './internal/AccountDeletionButton';
import ListItemClearCache from './internal/ListItemClearCache';

export default defineScreen('/account/', function AccountScreen() {
  useScreenTitle(t('Account'));
  const user = useCurrentUser();
  const roles = useUserRoles();

  return (
    <ScrollView>
      <ListItemKeyValue name={t('User ID')} value={user!.id} />
      <Divider />
      <ListItemKeyValue name={t('User Name')} value={user!.username} />
      <Divider />
      <ListItemKeyValue name={t('User Role')} value={roles.join(', ')} />
      <Divider />
      <ListItemKeyValue
        name={t('Access Token')}
        value={user!.accessToken}
        displayValue={user!.accessToken.substring(0, 4) + '****'}
      />
      <Divider />
      <ListItemClearCache />
      <Divider />
      <View style={styles.accountDeletion}>
        <AccountDeletionButton />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  accountDeletion: {
    margin: Spacing.Medium
  }
});
