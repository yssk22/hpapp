import { useAppConfig } from '@hpapp/features/app/settings';
import { isEmpty } from '@hpapp/foundation/string';
import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AccessTokenRequest } from 'expo-auth-session';
import * as GoogleAuth from 'expo-auth-session/providers/google';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import Firebase from './Firebase';

// Twitter implements twitter login on top of Firebase.
export default class Google extends Firebase {
  public getKey(): string {
    return 'google';
  }

  public getName(): string {
    return 'Google';
  }

  protected async getUsername(credential: FirebaseAuthTypes.UserCredential): Promise<string> {
    return credential.user.displayName ?? '';
  }

  public useFirebaseCredential(): () => Promise<FirebaseAuthTypes.AuthCredential | null> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appConfig = useAppConfig();
    const iosClientId = appConfig.firebaseIOSClientID;
    const androidClientId = appConfig.firebaseAndroidClientID;
    const clientId = Platform.select({
      ios: iosClientId,
      android: androidClientId
    });
    if (isEmpty(clientId)) {
      throw new Error('Google client ID is not set, check your environment config and rebuild the app');
    }

    // FIXME:
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [request, , promptAsync] = GoogleAuth.useAuthRequest({
      clientId,
      // we do code exchange by ourselfs to make the hook to provide the async func
      shouldAutoExchangeCode: false
    });
    // FIXME:
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fn = useCallback(async () => {
      const resp = await promptAsync();
      if (resp.type !== 'success') {
        return null;
      }
      const exchangeRequest = new AccessTokenRequest({
        clientId: request!.clientId,
        redirectUri: request!.redirectUri,
        scopes: request!.scopes,
        code: resp.params.code,
        extraParams: {
          code_verifier: request?.codeVerifier ?? ''
        }
      });
      const result = await exchangeRequest.performAsync({
        tokenEndpoint: 'https://oauth2.googleapis.com/token'
      });
      const credential = FirebaseAuth.GoogleAuthProvider.credential(result.idToken!, result.accessToken);
      return credential;
    }, [request, promptAsync]);
    return fn;
  }
}
