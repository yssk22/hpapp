import React from "react";
import { Icon } from "@rneui/themed";
import { useColor } from "@hpapp/contexts/settings/theme";
import { IconSize } from "@hpapp/features/common/constants";

export default function HPSortResultRankDiffIcon({
  diff,
}: {
  diff: number | undefined;
}) {
  const [primary] = useColor("primary");
  const [secondary] = useColor("secondary");
  if (diff === undefined) {
    return null;
  }
  if (diff > 100) {
    return <Icon type="entypo" name="new" size={IconSize.Small} />;
  } else if (diff >= 10) {
    return (
      <Icon
        type="feather"
        name="chevrons-up"
        size={IconSize.Small}
        color={primary}
      />
    );
  } else if (diff > 0) {
    return (
      <Icon
        type="feather"
        name="chevron-up"
        size={IconSize.Small}
        color={secondary}
      />
    );
  } else if (diff === 0) {
    return (
      <Icon type="material-community" name="minus" size={IconSize.Small} />
    );
  } else if (diff <= -10) {
    return (
      <Icon
        type="feather"
        name="chevrons-down"
        size={IconSize.Small}
        color={primary}
      />
    );
  } else {
    return (
      <Icon
        type="feather"
        name="chevron-down"
        size={IconSize.Small}
        color={secondary}
      />
    );
  }
}
