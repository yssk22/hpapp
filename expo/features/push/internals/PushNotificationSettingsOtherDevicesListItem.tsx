import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { IconSize } from '@hpapp/features/common/constants';
import { ListItem } from '@hpapp/features/common/list';
import { Icon } from '@rneui/base';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { graphql, useMutation } from 'react-relay';

import { PushNotificationSettingsContainerQuery$data } from './__generated__/PushNotificationSettingsContainerQuery.graphql';
import { PushNotificationSettingsOtherDevicesListItemDeleteMutation } from './__generated__/PushNotificationSettingsOtherDevicesListItemDeleteMutation.graphql';

type Settings = NonNullable<PushNotificationSettingsContainerQuery$data['me']['notificationSettings']>[number];

const PushNotificationSettingsOtherDevicesListItemDeleteMutationGraphQL = graphql`
  mutation PushNotificationSettingsOtherDevicesListItemDeleteMutation($tokenId: Int!) {
    me {
      removeNotificationToken(tokenId: $tokenId) {
        id
      }
    }
  }
`;

export type PushNotificationSettingsOtherDevicesListItemProps = {
  settings: Settings;
};

export default function PushNotificationSettingsOtherDevicesListItem({
  settings
}: PushNotificationSettingsOtherDevicesListItemProps) {
  const [deleteToken, isDeletingToken] = useMutation<PushNotificationSettingsOtherDevicesListItemDeleteMutation>(
    PushNotificationSettingsOtherDevicesListItemDeleteMutationGraphQL
  );
  const [color] = useThemeColor('secondary');
  const [disabledColor] = useThemeColor('disabled');
  return (
    <ListItem
      rightContent={
        isDeletingToken ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Icon
            name="delete"
            type="material-icons"
            color={color}
            onPress={() => {
              deleteToken({
                variables: {
                  tokenId: parseInt(settings!.id, 10)
                },
                updater: (store) => {
                  store.delete(settings!.id);
                }
              });
            }}
          />
        )
      }
    >
      <Text style={styles.deviceName}>{settings!.name}</Text>
      <View style={styles.enables}>
        <Icon
          name={settings!.enableNewPosts ? 'card-text' : 'card-text-outline'}
          type="material-community"
          color={settings!.enableNewPosts ? color : disabledColor}
          size={IconSize.Medium}
        />
        <Icon
          name={settings!.enablePaymentStart ? 'ticket-confirmation' : 'ticket-confirmation-outline'}
          type="material-community"
          color={settings!.enablePaymentStart ? color : disabledColor}
          size={IconSize.Medium}
        />
        <Icon
          name="payment"
          type="material"
          color={settings!.enablePaymentDue ? color : disabledColor}
          size={IconSize.Medium}
        />
      </View>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  deviceName: {
    fontWeight: 'bold'
  },
  enables: {
    flexDirection: 'row'
  }
});
