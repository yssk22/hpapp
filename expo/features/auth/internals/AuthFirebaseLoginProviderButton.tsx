import { Spacing } from '@hpapp/features/common/constants';
import { Button } from '@rneui/themed';
import React, { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Provider } from './firebase/types';

export type AuthFirebaseLoginProviderButtonProps = {
  spec: AuthFirebaseLoginProviderButtonSpec;
  disabled: boolean;
  onPress: (authenticate: () => Promise<boolean>) => void;
};

export type AuthFirebaseLoginProviderButtonSpec = {
  key: string;
  text: string;
  icon: React.ReactElement;
  provider: Provider;
  textColor: string;
  backgroundColor: string;
};

export default function AuthFirebaseLoginProviderButton({
  spec,
  disabled,
  onPress
}: {
  spec: AuthFirebaseLoginProviderButtonSpec;
  disabled: boolean;
  onPress: (authenticate: () => Promise<boolean>) => void;
}) {
  const [authenticate, isAuthenticating] = spec.provider.useAuthenticate();
  const handlePress = useCallback(() => {
    onPress(authenticate);
  }, [authenticate]);
  return (
    <Button
      testID={`AuthFirebaseLoginProviderButton.${spec.key}`}
      disabled={disabled || isAuthenticating}
      loading={isAuthenticating}
      buttonStyle={[styles.button, { backgroundColor: spec.backgroundColor }]}
      onPress={handlePress}
    >
      <View style={styles.icon}>{spec.icon}</View>
      <Text style={[styles.buttonText, { color: spec.textColor }]}>{spec.text}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 210,
    height: 44,
    borderRadius: 5,
    marginBottom: Spacing.Medium,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonText: {
    flexGrow: 1,
    fontWeight: 'bold',
    fontSize: 17
  },
  icon: {
    marginRight: Spacing.XSmall
  }
});
