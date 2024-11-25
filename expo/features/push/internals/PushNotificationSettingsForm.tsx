import { useThemeColor } from '@hpapp/features/app/theme';
import { AsyncState, Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { ListItemSwitch } from '@hpapp/features/common/list';
import { t } from '@hpapp/system/i18n';
import { Divider, Icon } from '@rneui/themed';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { graphql, useMutation } from 'react-relay';

import { PushNotificationSettingsContainerQuery$data } from './__generated__/PushNotificationSettingsContainerQuery.graphql';
import { PushNotificationSettingsFormMutation } from './__generated__/PushNotificationSettingsFormMutation.graphql';

const PushNotificationSettingsFormMutationGraphQL = graphql`
  mutation PushNotificationSettingsFormMutation($token: String!, $params: NotificationSettingsInput!) {
    me {
      upsertNotificationToken(token: $token, params: $params) {
        id
        token
        slug
        name
        enableNewPosts
        enablePaymentStart
        enablePaymentDue
      }
    }
  }
`;

type Settings = NonNullable<PushNotificationSettingsContainerQuery$data['me']['notificationSettings']>[number];

export type PushNotificationSettingsFormProps = {
  settings: Settings | null;
  token: AsyncState<string>;
};

export default function PushNotificationSettingsForm({ settings, token }: PushNotificationSettingsFormProps) {
  const [upsertNotificationToken, isUpserting] = useMutation<PushNotificationSettingsFormMutation>(
    PushNotificationSettingsFormMutationGraphQL
  );
  const [color] = useThemeColor('secondary');
  const [disabledColor] = useThemeColor('disabled');
  useEffect(() => {
    if ((settings == null || settings === undefined) && token.loading === false && token.data !== null) {
      if (!isUpserting) {
        const deviceName = `${Device.deviceName || 'Unknown'} (${Device.modelName})/${Constants.expoConfig!.slug}`;
        upsertNotificationToken({
          variables: {
            token: token.data!,
            params: {
              name: deviceName,
              slug: Constants.expoConfig!.slug,
              enableNewPosts: true,
              enablePaymentStart: true,
              enablePaymentDue: true
            }
          }
        });
      }
    }
  }, [token.data]);

  if (settings === null || settings === undefined) {
    if (token.error) {
      return null;
    }
    return <ActivityIndicator />;
  }
  return (
    <>
      <ListItemSwitch
        label={
          <View style={styles.listItemSwitchLabel}>
            <Icon
              name={settings.enableNewPosts ? 'card-text' : 'card-text-outline'}
              type="material-community"
              style={styles.listItemSwitchLabelIcon}
              color={settings.enableNewPosts ? color : disabledColor}
            />
            <Text>{t('New Posts')}</Text>
          </View>
        }
        value={settings.enableNewPosts}
        onValueChange={(v) => {
          upsertNotificationToken({
            variables: {
              token: token.data!,
              params: {
                name: settings.name,
                slug: settings.slug,
                enableNewPosts: v,
                enablePaymentStart: settings.enablePaymentStart,
                enablePaymentDue: settings.enablePaymentDue
              }
            }
          });
        }}
      />
      <Divider />
      <ListItemSwitch
        label={
          <View style={styles.listItemSwitchLabel}>
            <Icon
              name={settings.enablePaymentStart ? 'ticket-confirmation' : 'ticket-confirmation-outline'}
              type="material-community"
              style={styles.listItemSwitchLabelIcon}
              color={settings.enablePaymentStart ? color : disabledColor}
            />
            <Text>{t('Payment Start')}</Text>
          </View>
        }
        value={settings.enablePaymentStart}
        onValueChange={(v) => {
          upsertNotificationToken({
            variables: {
              token: token.data!,
              params: {
                name: settings.name,
                slug: settings.slug,
                enableNewPosts: settings.enableNewPosts,
                enablePaymentStart: v,
                enablePaymentDue: settings.enablePaymentDue
              }
            }
          });
        }}
      />
      <Divider />
      <ListItemSwitch
        label={
          <View style={styles.listItemSwitchLabel}>
            <Icon
              name="payment"
              type="material"
              style={styles.listItemSwitchLabelIcon}
              color={settings.enablePaymentDue ? color : disabledColor}
            />
            <Text>{t('Payment Start')}</Text>
          </View>
        }
        value={settings.enablePaymentDue}
        onValueChange={(v) => {
          upsertNotificationToken({
            variables: {
              token: token.data!,
              params: {
                name: settings.name,
                slug: settings.slug,
                enableNewPosts: settings.enableNewPosts,
                enablePaymentStart: settings.enablePaymentStart,
                enablePaymentDue: v
              }
            }
          });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listItemSwitchLabel: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemSwitchLabelIcon: {
    marginRight: Spacing.XSmall
  }
});
