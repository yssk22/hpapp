import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { CodedError } from 'expo-modules-core';
import { useCallback } from 'react';

import Firebase from './Firebase';

export default class Apple extends Firebase {
  public getKey(): string {
    return 'apple';
  }

  public getName(): string {
    return 'Apple';
  }

  public useFirebaseCredential(): () => Promise<FirebaseAuthTypes.AuthCredential | null> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(async () => {
      const nonce = this.genNonce();
      const nonceSHA256 = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
      try {
        const result = await AppleAuthentication.signInAsync({
          requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
          state: nonceSHA256
        });
        if (result.identityToken === null) {
          return null;
        }
        return auth.AppleAuthProvider.credential(result.identityToken, nonce);
      } catch (e) {
        if ((e as CodedError).code === 'ERR_REQUEST_CANCELED') {
          return null;
        }
        throw e;
      }
    }, []);
  }

  private genNonce(): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
