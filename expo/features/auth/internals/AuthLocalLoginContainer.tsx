import { useCurrentUserUpdator } from '@hpapp/features/app/settings';
import { useErrorMessage } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { Input, Button } from '@rneui/themed';
import { useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import useAuth from './useAuth';

export default function AuthLocalLoginContainer() {
  const updater = useCurrentUserUpdator();
  const [token, setToken] = useState('');
  const [Error, setError] = useErrorMessage();
  const [authenticate, isAuthenticating] = useAuth();
  const handlePress = useCallback(async () => {
    setError(null);
    try {
      // TODO: pass token
      const result = await authenticate({});
      updater(result.authenticate!);
    } catch (err) {
      setError(err);
    }
  }, [token]);
  const disableButton = isAuthenticating || token === '';
  return (
    <View style={styles.container} testID="AuthLocalLoginContainer">
      <View style={styles.container}>
        <Text style={styles.text}>
          Use `go run ./cmd/admin/ localauth` command to generate a user token for local authentication
        </Text>
        <Input
          testID="AuthLocalLoginContainer.inputToken"
          containerStyle={styles.input}
          placeholder="server token"
          onChangeText={(t) => {
            setToken(t);
          }}
        />
        <Button
          testID="AuthLocalLoginContainer.btnLogin"
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    width: 250,
    textAlign: 'center',
    marginBottom: Spacing.Medium
  },
  input: {
    width: 200
  },
  button: {
    width: 200
  }
});
