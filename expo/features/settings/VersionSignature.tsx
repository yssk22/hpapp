import { useCurrentUser, useUserRoles } from "@hpapp/features/auth";
import Link from "@hpapp/features/common/components/Link";
import Text from "@hpapp/features/common/components/Text";
import React from "react";
import { View, StyleSheet } from "react-native";
import { FontSize, Spacing } from "@hpapp/features/common/constants";
import {
  ApplicationVersion,
  BuildNumber,
} from "@hpapp/features/common/version";

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    padding: Spacing.Small,
  },
  text: {
    fontSize: FontSize.Small,
    fontStyle: "italic",
  },
});

const VersionSignature: React.FC = () => {
  const [user, _] = useCurrentUser();
  const roles = useUserRoles(user);
  return (
    <View style={styles.container}>
      <Link href="https://twitter.com/hellofanapp">
        <Text style={styles.text}>Developed by @hellofanapp</Text>
      </Link>
      <Text style={styles.text}>
        Version {ApplicationVersion} (Buld: {BuildNumber})
      </Text>
      <Text style={styles.text}>
        ID: {user?.id} ({roles.join(", ")})
      </Text>
    </View>
  );
};

export default VersionSignature;
