import { useCurrentUser } from '@hpapp/features/app/settings';
import { useUserRoles } from '@hpapp/features/auth';
import { Link, Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { ApplicationVersion, BuildNumber } from '@hpapp/features/common/version';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    padding: Spacing.Small
  },
  text: {
    fontSize: FontSize.Small,
    fontStyle: 'italic'
  }
});

export default function HomeTabSettingsVersionSignature() {
  const user = useCurrentUser();
  const roles = useUserRoles(user);
  return (
    <View style={styles.container}>
      <Link href="https://x.com/hellofanapp">
        <Text style={styles.text}>Developed by @hellofanapp</Text>
      </Link>
      <Text style={styles.text}>
        Version {ApplicationVersion} (Buld: {BuildNumber})
      </Text>
      <Text style={styles.text}>
        ID: {user?.id} ({roles.join(', ')})
      </Text>
    </View>
  );
}
