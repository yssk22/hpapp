import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { View, StyleSheet, Text } from "react-native";
import * as object from "@hpapp/foundation/object";
import {
  FeedQuery,
  HPAssetType,
} from "@hpapp/features/feed/__generated__/FeedQuery.graphql";
import { Suspense } from "react";
import { FeedQueryFragmentQuery } from "@hpapp/features/feed/__generated__/FeedQueryFragmentQuery.graphql";
import { FeedQuery_helloproject_query_feed$key } from "@hpapp/features/feed/__generated__/FeedQuery_helloproject_query_feed.graphql";
import FeedItem from "@hpapp/features/feed/FeedItem";

const FeedQueryGraphQL = graphql`
  query FeedQuery(
    $params: HPFeedQueryParamsInput!
    $first: Int
    $after: Cursor
  ) {
    helloproject {
      ...FeedQuery_helloproject_query_feed
    }
  }
`;

const FeedQueryFragmentGraphQL = graphql`
  fragment FeedQuery_helloproject_query_feed on HelloProjectQuery
  @refetchable(queryName: "FeedQueryFragmentQuery") {
    feed(params: $params, first: $first, after: $after)
      @connection(key: "FeedQuery_helloproject_query_feed") {
      edges {
        node {
          id
          ...FeedItemFragment
        }
      }
    }
  }
`;

export type FeedProps = {
  assetTypes: Array<HPAssetType>;
  numFetch: number;
  memberIds: Array<string>;
};

export default function Feed(props: FeedProps) {
  return (
    <Suspense fallback={<></>}>
      <FeedLoader {...props}></FeedLoader>
    </Suspense>
  );
}

function FeedLoader({ memberIds, assetTypes }: FeedProps) {
  const data = useLazyLoadQuery<FeedQuery>(FeedQueryGraphQL, {
    first: 20,
    params: {
      // TODO: use props
      assetTypes: ["ameblo"],
      memberIDs: ["8589934592"],
    },
  });
  const fragment = usePaginationFragment<
    FeedQueryFragmentQuery,
    FeedQuery_helloproject_query_feed$key
  >(FeedQueryFragmentGraphQL, data.helloproject);
  return (
    <View style={styles.container}>
      {fragment.data.feed!.edges!.map((edge) => {
        return <FeedItem key={edge?.node?.id} data={edge?.node!} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
