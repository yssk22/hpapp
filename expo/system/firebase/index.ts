import analytics from '@react-native-firebase/analytics';
import appcheck from '@react-native-firebase/app-check';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  const provider = appcheck().newReactNativeFirebaseAppCheckProvider();
  if (__DEV__) {
    // development build is not distributed through the app store so AppCheck provider has to be 'debug'
    provider.configure({
      apple: {
        provider: 'deviceCheck'
      },
      android: {
        provider: 'debug',
        debugToken: process.env.EXPO_PUBLIC_APP_CHECK_DEBUG_TOKEN
      }
    });
    appcheck().initializeAppCheck({
      provider,
      isTokenAutoRefreshEnabled: true
    });
  } else {
    provider.configure({
      apple: {
        provider: 'deviceCheck'
      },
      android: {
        provider: 'playIntegrity'
      }
    });
    appcheck().initializeAppCheck({
      provider,
      isTokenAutoRefreshEnabled: true
    });
  }
}

export async function getAppCheckToken() {
  return await appcheck().getToken();
}

export async function getIdToken() {
  return await auth().currentUser?.getIdToken();
}

export function getCurrentUser() {
  return auth().currentUser;
}

export async function signInWithCredential(credential: FirebaseAuthTypes.AuthCredential) {
  return await auth().signInWithCredential(credential);
}

export async function logEvent(name: string, properties?: Record<string, any>): Promise<void> {
  return analytics().logEvent(name, properties);
}

export async function logLogin(method: string, userId: string): Promise<void> {
  analytics().logLogin({
    method
  });
  analytics().setUserId(userId);
}

export async function logLogout(): Promise<void> {
  analytics().setUserId(null);
}

export async function updateUserProperties(
  userId: string | null,
  properties: Record<string, string | null>
): Promise<void> {
  const a = analytics();
  await Promise.all([a.setUserId(userId), a.setUserProperties(properties)]);
}

export async function logScreenView(screen: string) {
  analytics().logScreenView({
    screen_name: screen,
    screen_class: screen
  });
}
