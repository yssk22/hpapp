import FirebaseAuth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Provider } from "./types";
import { useCallback, useState } from "react";

const auth = FirebaseAuth();

export default abstract class Firebase extends Provider {
  static async getAccessToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user === null) {
      return null;
    }
    return await user.getIdToken();
  }
  static getAuth() {
    return auth;
  }

  protected abstract useFirebaseCredential(): () => Promise<FirebaseAuthTypes.AuthCredential | null>;

  public useAuthenticate(): [() => Promise<boolean>, boolean] {
    const fn = this.useFirebaseCredential();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const authenticate = useCallback(async () => {
      setIsAuthenticating(true);
      try {
        const credentials = await fn();
        if (credentials === null) {
          return false;
        }
        const user = await auth.signInWithCredential(credentials);
        const idToken = await user.user.getIdToken();
        return true;
        // return {
        //   provider: this.getKey(),
        //   accessToken: idToken,
        //   refreshToken: "",
        // };
      } finally {
        setIsAuthenticating(false);
      }
    }, [fn]);

    return [authenticate, isAuthenticating];
  }
}
