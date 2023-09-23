import { useState, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "@rneui/themed";
import { Spacing } from "@hpapp/features/common/constants";
import { User } from "../index";
import useAuth from "@hpapp/features/auth/hooks/useAuth";
import useErrorMessage from "@hpapp/features/misc/useErrorMessage";
import { useCurrentUser } from "@hpapp/features/auth";

export default function LocalLoginContainer({
  onAuthenticated,
}: {
  onAuthenticated: (user: User) => void;
}) {
  const [_, setUser] = useCurrentUser();
  const [token, setToken] = useState("");
  const [Error, setError] = useErrorMessage();
  const [authenticate, isAuthenticating] = useAuth();
  const handlePress = useCallback(async () => {
    setError(null);
    try {
      const result = await authenticate({
        input: {
          provider: "localauth",
          accessToken: token,
          refreshToken: "",
        },
      });
      onAuthenticated(result.authenticate!);
    } catch (err) {
      setError(err);
      return;
    }
  }, [token]);
  const disableButton = isAuthenticating || token === "";
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>
          Use `go run ./cmd/admin/ localauth` command to generate a user token
          for local authentication
        </Text>
        <Input
          testID="inputToken"
          containerStyle={styles.input}
          placeholder="server token"
          onChangeText={(t) => {
            setToken(t);
          }}
        />
        <Button
          testID="btnLogin"
          containerStyle={styles.button}
          type="solid"
          onPress={handlePress}
          disabled={disableButton}
        >
          Login
        </Button>
        <Error />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
