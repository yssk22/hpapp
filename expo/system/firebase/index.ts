import analytics from '@react-native-firebase/analytics';
import appcheck from '@react-native-firebase/app-check';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect } from 'react';
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

export async function logLogin(method: string, userId: string): Promise<void> {
  analytics().logLogin({
    method
  });
  analytics().setUserId(userId);
}

export async function logLogout(): Promise<void> {
  analytics().setUserId(null);
}

export async function useSetUserId(userId: string | null) {
  useEffect(() => {
    analytics().setUserId(userId);
  }, [userId]);
}

export async function useLogScreenView(screen: string) {
  useEffect(() => {
    analytics().logScreenView({
      screen_name: screen,
      screen_class: screen
    });
  }, [screen]);
}
