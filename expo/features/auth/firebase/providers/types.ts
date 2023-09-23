import * as WebBrowser from "expo-web-browser";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AuthRequestConfig, DiscoveryDocument } from "expo-auth-session";

// required to make expo-web-browser work
WebBrowser.maybeCompleteAuthSession();

type OAuthUser = {
  username: string;
  accessToken: string;
};

abstract class Provider {
  public abstract getName(): string;
  public abstract getKey(): string;

  public abstract useAuthenticate(): [() => Promise<boolean>, boolean];
}

export { OAuthUser, Provider };
