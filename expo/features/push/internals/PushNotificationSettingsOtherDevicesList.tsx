import { Divider } from '@rneui/themed';

import PushNotificationSettingsOtherDevicesListItem from './PushNotificationSettingsOtherDevicesListItem';
import { PushNotificationSettingsContainerQuery$data } from './__generated__/PushNotificationSettingsContainerQuery.graphql';

type Settings = NonNullable<PushNotificationSettingsContainerQuery$data['me']['notificationSettings']>[number];

export type PushNotificationSettingsOtherDevicesListProps = {
  settingsList: Settings[];
};

export default function PushNotificationSettingsOtherDevicesList({
  settingsList
}: PushNotificationSettingsOtherDevicesListProps) {
  return settingsList.map((settings) => {
    return (
      <>
        <PushNotificationSettingsOtherDevicesListItem key={settings!.id} settings={settings} />
        <Divider />
      </>
    );
  });
}
