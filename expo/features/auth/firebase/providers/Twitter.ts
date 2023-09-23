import { useCallback, useEffect, useMemo } from "react";
import * as AuthSession from "expo-auth-session";
import FirebaseAuth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import Firebase from "./Firebase";

// Twitter implements twitter login on top of Firebase.
//
// Firebase does not support Twitter OAuth 2.0, so we need to use OAuth 1.0a with 3 legged flow.
// and this code needs OAuth 1.0a serve side endpoint to avoid storing client secret in the app.
//
export default class Twitter extends Firebase {
  private requestTokenUri: string;
  private accessTokenUri: string;
  private projectNameForProxy: string; // @account_name/slug format

  constructor(
    requestTokenUri: string,
    accessTokenUri: string,
    projectNameForProxy: string
  ) {
    super();
    this.requestTokenUri = requestTokenUri;
    this.accessTokenUri = accessTokenUri;
    this.projectNameForProxy = projectNameForProxy;
  }

  public getKey(): string {
    return "twitter";
  }

  public getName(): string {
    return "Twitter";
  }

  protected async getUsername(
    credential: FirebaseAuthTypes.UserCredential
  ): Promise<string> {
    return credential.user.displayName || "";
  }

  public useFirebaseCredential(): () => Promise<FirebaseAuthTypes.AuthCredential | null> {
    const fn = useCallback(async () => {
      const redirectUri = AuthSession.makeRedirectUri({
        projectNameForProxy: this.projectNameForProxy,
        useProxy: true,
      });
      const p0 = new URLSearchParams();
      p0.append("callback_url", redirectUri);
      const requestTokenResp = await fetch(
        `${this.requestTokenUri}?${p0.toString()}`
      );
      const requestToken = await requestTokenResp.json();
      if (requestTokenResp.status !== 200) {
        throw new Error(requestToken["error"] || "unknown error");
      }
      const p1 = new URLSearchParams();
      Object.keys(requestToken).forEach((key) => {
        p1.append(key, requestToken[key]);
      });
      const authResponse = await AuthSession.startAsync({
        authUrl: `https://api.twitter.com/oauth/authenticate?${p1.toString()}`,
        projectNameForProxy: this.projectNameForProxy,
      });
      if (authResponse.type !== "success") {
        return null;
      }
      const p2 = new URLSearchParams();
      p2.append("oauth_token", requestToken.oauth_token);
      p2.append("oauth_token_secret", requestToken.oauth_token_secret);
      p2.append("oauth_verifier", authResponse.params.oauth_verifier);
      const accessTokenResp = await fetch(
        `${this.accessTokenUri}?${p2.toString()}`
      );
      const accessToken = await accessTokenResp.json();
      if (!accessToken.access_token) {
        return null;
      }
      // now we have both access_token and access_token secret to get ID token from Firebase
      return FirebaseAuth.TwitterAuthProvider.credential(
        accessToken.access_token,
        accessToken.access_token_secret
      );
    }, [this]);
    return fn;
  }
}
