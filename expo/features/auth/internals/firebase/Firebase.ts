import { getCurrentUser, signInWithCredential } from '@hpapp/system/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useCallback, useState } from 'react';

import { Provider } from './types';

export default abstract class Firebase extends Provider {
  static async getAccessToken(): Promise<string | null> {
    const user = getCurrentUser();
    if (user === null) {
      return null;
    }
    return await user.getIdToken();
  }

  protected abstract useFirebaseCredential(): () => Promise<FirebaseAuthTypes.AuthCredential | null>;

  public useAuthenticate(): [() => Promise<boolean>, boolean] {
    const fn = this.useFirebaseCredential();
    // FIXME:
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    // FIXME:
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const authenticate = useCallback(async () => {
      setIsAuthenticating(true);
      try {
        const credentials = await fn();
        if (credentials === null) {
          return false;
        }
        const user = await signInWithCredential(credentials);
        const token = await user.user?.getIdToken();
        return token !== null;
      } finally {
        setIsAuthenticating(false);
      }
    }, [fn]);

    return [authenticate, isAuthenticating];
  }
}
