import { useState, useCallback } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { IconSize, Spacing } from "@hpapp/features/common/constants";
import { User } from "../index";
import Constants from "expo-constants";
import { ProviderButtonSpec } from "@hpapp/features/auth/firebase/ProviderLoginButton";
import ProviderLoginButton from "@hpapp/features/auth/firebase/ProviderLoginButton";
import useAuth from "@hpapp/features/auth/hooks/useAuth";
import useErrorMessage from "@hpapp/features/misc/useErrorMessage";
import Apple from "@hpapp/features/auth/firebase/providers/Apple";
import { Icon } from "@rneui/themed";
import Google from "@hpapp/features/auth/firebase/providers/Google";

export default function FirebaseLoginContainer({
  onAuthenticated,
}: {
  onAuthenticated: (user: User) => void;
}) {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [auth] = useAuth();
  const [Error, setError] = useErrorMessage();
  const handlePress = useCallback(
    async (authenticate: () => Promise<boolean>) => {
      setIsAuthenticating(true);
      try {
        const ok = await authenticate();
        if (!ok) {
          setIsAuthenticating(false);
          return;
        }
        const result = await auth({});
        onAuthenticated(result.authenticate!);
      } catch (e) {
        setError(e);
        setIsAuthenticating(false);
      }
    },
    []
  );
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {providers!.map((spec) => {
          return (
            <ProviderLoginButton
              key={spec.key}
              spec={spec}
              disabled={isAuthenticating}
              onPress={handlePress}
            />
          );
        })}
        <Error />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: Spacing.Medium,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    width: 250,
    textAlign: "center",
    marginBottom: Spacing.Medium,
  },
  input: {
    width: 200,
  },
  button: {
    width: 200,
  },
});

const googleIOSClientID: string =
  Constants.expoConfig?.extra!.hpapp!.auth!.google!.iosClientId!;
const googleAndroidClientID: string =
  Constants.expoConfig?.extra!.hpapp!.auth!.google!.androidClientId!;

const AuthProviderSpecApple: ProviderButtonSpec = {
  key: "Apple",
  text: "Sign in with Apple",
  textColor: "white",
  backgroundColor: "#000000",
  provider: new Apple(),
  icon: (
    <Icon
      type="ionicon"
      name="logo-apple"
      color="white"
      size={IconSize.Small}
    />
  ),
};

const AuthProviderSpecGoogle: ProviderButtonSpec = {
  key: "google",
  text: "Sign in with Google",
  textColor: "white",
  backgroundColor: "#dd4b39",
  provider: new Google(googleIOSClientID, googleAndroidClientID),
  icon: (
    <Icon
      type="ionicon"
      name="logo-google"
      color="white"
      size={IconSize.Small}
    />
  ),
};

const providers = Platform.select({
  ios: [AuthProviderSpecApple, AuthProviderSpecGoogle],
  android: [AuthProviderSpecGoogle],
});
