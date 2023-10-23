import { View, Text, StyleSheet } from "react-native";
import { FeedItemFragment$key } from "@hpapp/features/feed/__generated__/FeedItemFragment.graphql";
import { graphql, useFragment } from "react-relay";
import ExternalImage from "@hpapp/features/common/components/image";
import * as date from "@hpapp/foundation/date";
import { useColor } from "@hpapp/contexts/settings/theme";
import { Icon } from "@rneui/themed";
import { FontSize, IconSize, Spacing } from "@hpapp/features/common/constants";
import AssetIcon from "@hpapp/features/feed/AssetIcon";

const FeedItemFragmentGraphQL = graphql`
  fragment FeedItemFragment on HPFeedItem {
    id
    title
    sourceID
    sourceURL
    imageURL
    assetType
    postAt
    ownerMember {
      id
      key
    }
    taggedMembers {
      id
      key
    }
    myViewHistory {
      id
      isFavorite
    }
  }
`;

export default function FeedItem({ data }: { data: FeedItemFragment$key }) {
  const item = useFragment<FeedItemFragment$key>(FeedItemFragmentGraphQL, data);
  const imageUrl = item.imageURL || "";
  const dateString = date.toDateTimeString(item.postAt);
  const [primary] = useColor("primary");
  const [secondary] = useColor("secondary");
  return (
    <View style={styles.container}>
      <View style={styles.titleAndMetadata}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metadata}>
          {/* TODO: AssetIcon needs rebuild: <AssetIcon type={item.assetType} size={IconSize.Small} /> */}
          <Text style={styles.dateString}>{dateString}</Text>
          {item.myViewHistory == undefined && (
            <Icon
              type="entypo"
              name="new"
              size={IconSize.Small}
              color={secondary}
            />
          )}
          {item.myViewHistory?.isFavorite && (
            <Icon
              type="entypo"
              name="heart"
              size={IconSize.Small}
              color={secondary}
            />
          )}
        </View>
      </View>
      <ExternalImage uri={imageUrl} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: 90,
    flexDirection: "row",
    padding: Spacing.XSmall,
  },
  image: {
    width: 80,
    height: 80,
  },
  titleAndMetadata: {
    flexGrow: 1,
    flexDirection: "column",
  },
  title: {
    flexGrow: 1,
  },
  metadata: {
    flexDirection: "row",
  },
  dateString: {
    marginRight: Spacing.Small,
  },
  icon: {
    marginRight: Spacing.Small,
  },
});

function getOptimizedImageUrl(src: string) {
  if (src.startsWith("https://stat.ameba.jp/user_images/")) {
    // TODO: choose the proper size based on the screen size.
    return `${src}?cpd=300`;
  }
  return src;
}
