import { HPMember, useHelloProject, useMe } from "@hpapp/contexts/serviceroot";
import { HPFollowHPFollowType } from "@hpapp/contexts/serviceroot/__generated__/meFragment.graphql";
import { HPFollowType } from "@hpapp/contexts/serviceroot/me";
import { useColor } from "@hpapp/contexts/settings/theme";
import ExternalImage from "@hpapp/features/common/components/image";
import { MemberIconSize } from "@hpapp/features/common/constants";
import { Icon } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

export default function MemberIcon({
  member,
  size = MemberIconSize.Medium,
  showFollowIcon = false,
  onPress = () => {},
}: {
  member: HPMember | string;
  size?: number;
  showFollowIcon?: boolean;
  onPress?: () => void;
}) {
  const hp = useHelloProject();
  const me = useMe();
  const m = hp.useMember(member);
  const [color, contrast] = useColor("primary");
  return (
    <View
      style={{
        width: size,
        height: size,
      }}
    >
      <ExternalImage
        uri={m!.thumbnailURL}
        style={{ width: size, height: size }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
