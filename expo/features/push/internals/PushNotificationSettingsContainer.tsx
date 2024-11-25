import { ListItemSectionHeader } from '@hpapp/features/common/list';
import { t } from '@hpapp/system/i18n';
import Constants from 'expo-constants';
import * as object from 'foundation/object';
import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { graphql, useLazyLoadQuery } from 'react-relay';

import PushNotificationPermissionErrorBanner from './PushNotificationPermissionErrorBanner';
import PushNotificationSettingsForm from './PushNotificationSettingsForm';
import PushNotificationSettingsOtherDevicesList from './PushNotificationSettingsOtherDevicesList';
import { PushNotificationSettingsContainerQuery } from './__generated__/PushNotificationSettingsContainerQuery.graphql';
import usePushNotificationToken, { ErrPermissionDenied } from './usePushNotificationToken';

const PushNotificationSettingsContainerQueryGraphQL = graphql`
  query PushNotificationSettingsContainerQuery($slug: String!) {
    me {
      id
      notificationSettings(slug: $slug) {
        id
        createdAt
        updatedAt
        slug
        name
        token
        enableNewPosts
        enablePaymentStart
        enablePaymentDue
      }
    }
  }
`;

export default function PushNotificationSettingsContainer() {
  const data = useLazyLoadQuery<PushNotificationSettingsContainerQuery>(PushNotificationSettingsContainerQueryGraphQL, {
    slug: Constants.expoConfig!.slug
  });
  const token = usePushNotificationToken();
  const settings = (data.me?.notificationSettings ?? []).filter((v) => v !== null);
  const myDeviceSettings = useMemo(() => {
    return object.first(settings.filter((v) => v!.token === token.data));
  }, [data, token.data]);
  const otherDeviceSettings = useMemo(() => {
    return settings.filter((v) => v!.token !== token.data);
  }, [data, token.data]);
  return (
    <View style={styles.container}>
      {token.error === ErrPermissionDenied && <PushNotificationPermissionErrorBanner />}
      <ListItemSectionHeader label={t('This Device')} />
      <PushNotificationSettingsForm settings={myDeviceSettings} token={token} />
      <ListItemSectionHeader label={t('Other Devices')} />
      <PushNotificationSettingsOtherDevicesList settingsList={otherDeviceSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
