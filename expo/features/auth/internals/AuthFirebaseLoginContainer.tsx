import { useCurrentUserUpdator } from '@hpapp/features/app/settings';
import { useErrorMessage } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { logEvent } from '@hpapp/system/firebase';
import { Icon } from '@rneui/themed';
import { useState, useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import AuthFirebaseLoginProviderButton, {
  AuthFirebaseLoginProviderButtonSpec
} from './AuthFirebaseLoginProviderButton';
import Apple from './firebase/Apple';
import Google from './firebase/Google';
import useAuth from './useAuth';

export default function AuthFirebaseLoginContainer() {
  const update = useCurrentUserUpdator();
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [auth] = useAuth();
  const [Error, setError] = useErrorMessage();
  const handlePress = useCallback(async (authenticate: () => Promise<boolean>) => {
    setIsAuthenticating(true);
    try {
      const ok = await authenticate();
      if (!ok) {
        setIsAuthenticating(false);
        return;
      }
      const result = await auth({});
      logEvent('login_completed');
      update(result.authenticate!);
    } catch (e: any) {
      logEvent('login_failed', {
        error: e.toString()
      });
      setError(e);
      setIsAuthenticating(false);
    }
  }, []);
  return (
    <View style={styles.container} testID="AuthFirebaseLoginContainer">
      <View style={styles.container}>
        {providers!.map((spec) => {
          return (
            <AuthFirebaseLoginProviderButton
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

// const googleIOSClientID: string = Constants.expoConfig?.extra!.hpapp!.auth!.google!.iosClientId!;
// const googleAndroidClientID: string = Constants.expoConfig?.extra!.hpapp!.auth!.google!.androidClientId!;

const AuthProviderSpecApple: AuthFirebaseLoginProviderButtonSpec = {
  key: 'Apple',
  text: 'Sign in with Apple',
  textColor: 'white',
  backgroundColor: '#000000',
  provider: new Apple(),
  icon: <Icon type="ionicon" name="logo-apple" color="white" size={IconSize.Small} />
};

const AuthProviderSpecGoogle: AuthFirebaseLoginProviderButtonSpec = {
  key: 'google',
  text: 'Sign in with Google',
  textColor: 'white',
  backgroundColor: '#dd4b39',
  provider: new Google(),
  icon: <Icon type="ionicon" name="logo-google" color="white" size={IconSize.Small} />
};

const providers = Platform.select({
  ios: [AuthProviderSpecApple, AuthProviderSpecGoogle],
  android: [AuthProviderSpecGoogle]
});
