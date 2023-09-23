import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import * as GoogleAuth from "expo-auth-session/providers/google";
import FirebaseAuth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import Firebase from "./Firebase";
import { AccessTokenRequest } from "expo-auth-session";

// Twitter implements twitter login on top of Firebase.
export default class Google extends Firebase {
  private iosClientId: string;
  private androidClientId: string;

  constructor(iosClientId: string, androidClientId: string) {
    super();
    this.iosClientId = iosClientId;
    this.androidClientId = androidClientId;
  }

  public getKey(): string {
    return "google";
  }

  public getName(): string {
    return "Google";
  }

  protected async getUsername(
    credential: FirebaseAuthTypes.UserCredential
  ): Promise<string> {
    return credential.user.displayName || "";
  }

  public useFirebaseCredential(): () => Promise<FirebaseAuthTypes.AuthCredential | null> {
    const clientId = Platform.select({
      ios: this.iosClientId,
      android: this.androidClientId,
    });
    const [request, resp__, promptAsync] = GoogleAuth.useAuthRequest({
      clientId: clientId,
      // we do code exchange by ourselfs to make the hook to provide the async func
      shouldAutoExchangeCode: false,
    });
    const fn = useCallback(async () => {
      const resp = await promptAsync();
      if (resp.type !== "success") {
        return null;
      }
      const exchangeRequest = new AccessTokenRequest({
        clientId: request!.clientId,
        redirectUri: request!.redirectUri,
        scopes: request!.scopes,
        code: resp.params.code,
        extraParams: {
          code_verifier: request?.codeVerifier || "",
        },
      });
      const result = await exchangeRequest.performAsync({
        tokenEndpoint: "https://oauth2.googleapis.com/token",
      });
      const credential = FirebaseAuth.GoogleAuthProvider.credential(
        result.idToken!,
        result.accessToken
      );
      return credential;
    }, [request, promptAsync]);
    return fn;
  }
}
