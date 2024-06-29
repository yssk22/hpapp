import appcheck from '@react-native-firebase/app-check';
import auth from '@react-native-firebase/auth';

const provider = appcheck().newReactNativeFirebaseAppCheckProvider();
provider.configure({
  apple: {
    provider: 'deviceCheck'
  }
});

appcheck().initializeAppCheck({
  provider,
  isTokenAutoRefreshEnabled: true
});

export async function getAppCheckToken() {
  return await appcheck().getToken();
}

export async function getIdToken() {
  return await auth().currentUser?.getIdToken();
}

/**
 * Provides a http header generator that includes Firebase tokens.
 * @returns a function that returns a promise that resolves to a record of headers with X-HTTP* including X-HTTP-Cilent-Authorization and X-HTTP-3P-Authorization.
 */
export async function getHeaderWithTokens() {
  const clientToken = (await getAppCheckToken()).token;
  const authToken = await getIdToken();
  return {
    // 'X-HPAPP-VERSION': Constants.expoConfig?.version ?? '',
    // 'X-HPAPP-EXPO-VERSION': Constants.expoConfig?.runtimeVersion?.toString() ?? '',
    // 'X-HPAPP-DEVICE-INFO': `${Device.modelName}/${Device.osName}/${Device.osVersion}`,
    'X-HPAPP-CLIENT-AUTHORIZATION': `Bearer ${clientToken}`,
    'X-HPAPP-3P-AUTHORIZATION': `Bearer ${authToken}`
  };
}
