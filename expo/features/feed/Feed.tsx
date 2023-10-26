import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { View, StyleSheet, Text } from "react-native";
import {
  FeedQuery,
  HPAssetType,
} from "@hpapp/features/feed/__generated__/FeedQuery.graphql";
import { Suspense } from "react";
import { FeedQueryFragmentQuery } from "@hpapp/features/feed/__generated__/FeedQueryFragmentQuery.graphql";
import { FeedQuery_helloproject_query_feed$key } from "@hpapp/features/feed/__generated__/FeedQuery_helloproject_query_feed.graphql";
import FeedListItem from "@hpapp/features/feed/FeedListItem";
import { FlatList } from "react-native";
import * as date from "@hpapp/foundation/date";

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
          ...FeedListItemFragment
        }
      }
    }
  }
`;

export type FeedProps = {
  assetTypes: Array<HPAssetType>;
  numFetch: number;
  memberIds: Array<string>;
  useMemberTaggings: boolean;
};

export default function Feed(props: FeedProps) {
  return (
    <Suspense fallback={<></>}>
      <FeedLoader {...props}></FeedLoader>
    </Suspense>
  );
}

const minPostAtForTaggedFeed = 3 * date.N_DAYS;

function FeedLoader({
  numFetch,
  memberIds,
  assetTypes,
  useMemberTaggings,
}: FeedProps) {
  // TODO: #28 Revisit Tagged Feed Feature
  // We use 30 days window when fetching tagged feed to get the items without timeout.
  // but this prevents users from loading items older than 30 days.
  const minPostAt =
    useMemberTaggings || true
      ? new Date(
          date.getToday().getTime() - minPostAtForTaggedFeed
        ).toISOString()
      : null;
  const data = useLazyLoadQuery<FeedQuery>(FeedQueryGraphQL, {
    first: numFetch,
    params: {
      assetTypes: assetTypes,
      memberIDs: memberIds,
      useMemberTaggings: useMemberTaggings,
      minPostAt: minPostAt,
    },
  });
  const fragment = usePaginationFragment<
    FeedQueryFragmentQuery,
    FeedQuery_helloproject_query_feed$key
  >(FeedQueryFragmentGraphQL, data.helloproject);
  return (
    <FlatList
      data={fragment.data.feed!.edges!}
      keyExtractor={(item) => item!.node!.id}
      renderItem={({ item }) => {
        return <FeedListItem key={item!.node!.id} data={item?.node!} />;
      }}
      onEndReached={() => {
        if (fragment.hasNext) {
          fragment.loadNext(numFetch);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
});
