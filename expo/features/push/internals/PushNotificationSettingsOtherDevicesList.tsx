import { Divider } from '@rneui/themed';
import React from 'react';

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
      <React.Fragment key={settings!.id}>
        <PushNotificationSettingsOtherDevicesListItem settings={settings} />
        <Divider />
      </React.Fragment>
    );
  });
}
