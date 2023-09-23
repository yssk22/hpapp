import { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Spacing } from "@hpapp/features/common/constants";
import { User } from "../index";
import { ProviderButtonSpec } from "@hpapp/features/auth/firebase/ProviderLoginButton";
import ProviderLoginButton from "@hpapp/features/auth/firebase/ProviderLoginButton";
import useAuth from "@hpapp/features/auth/hooks/useAuth";
import useErrorMessage from "@hpapp/features/misc/useErrorMessage";

export default function FirebaseLoginContainer({
  providerSpecs,
  onAuthenticated,
}: {
  providerSpecs: Array<ProviderButtonSpec>;
  onAuthenticated: (user: User) => void;
}) {
  const [isAuthenticating, setisAuthenticating] = useState<boolean>(false);
  const [auth] = useAuth();
  const [Error, setError] = useErrorMessage();
  const handlePress = useCallback(
    async (authenticate: () => Promise<boolean>) => {
      setisAuthenticating(true);
      try {
        const ok = await authenticate();
        if (!ok) {
          return;
        }
        const result = await auth({});
        onAuthenticated(result.authenticate!);
      } catch (e) {
        setError(e);
        setisAuthenticating(false);
      }
    },
    []
  );
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {providerSpecs.map((spec) => {
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
