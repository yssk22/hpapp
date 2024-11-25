import { useAsync } from '@hpapp/features/common';
import Constants from 'expo-constants';
import { isDevice } from 'expo-device';
import * as Notifications from 'expo-notifications';

const ErrPermissionDenied = new Error('permission denied');
const ErrNotDevice = new Error('not device');

export default function usePushNotificationToken() {
  return useAsync(getToken);
}

async function getToken(): Promise<string> {
  if (!isDevice) {
    throw ErrNotDevice;
  }
  let granted = false;
  const { status } = await Notifications.getPermissionsAsync();
  granted = status === 'granted';
  if (!granted) {
    const { status } = await Notifications.requestPermissionsAsync();
    granted = status === 'granted';
  }
  if (!granted) {
    throw ErrPermissionDenied;
  }
  return (
    await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId
    })
  ).data;
}

export { ErrPermissionDenied, ErrNotDevice };
