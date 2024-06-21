import { getToken as getClientToken } from '@hpapp/features/auth/firebase/appcheck';
import { getToken as getAuthToken } from '@hpapp/features/auth/firebase/user';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

/**
 * Provides a http header generator that includes Firebase tokens.
 * @returns a function that returns a promise that resolves to a record of headers with X-HTTP* including X-HTTP-Cilent-Authorization and X-HTTP-3P-Authorization.
 */
export default function useFirebaseTokensInHttpHeader() {
  return async (): Promise<Record<string, string>> => {
    const clientToken = (await getClientToken()).token;
    const authToken = await getAuthToken();
    return {
      'X-HPAPP-VERSION': Constants.expoConfig?.version ?? '',
      'X-HPAPP-EXPO-VERSION': Constants.expoConfig?.runtimeVersion?.toString() ?? '',
      'X-HPAPP-DEVICE-INFO': `${Device.modelName}/${Device.osName}/${Device.osVersion}`,
      'X-HPAPP-CLIENT-AUTHORIZATION': `Bearer ${clientToken}`,
      'X-HPAPP-3P-AUTHORIZATION': `Bearer ${authToken}`
    };
  };
}
