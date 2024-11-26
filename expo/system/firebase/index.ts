import analytics from '@react-native-firebase/analytics';
import appcheck from '@react-native-firebase/app-check';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
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
