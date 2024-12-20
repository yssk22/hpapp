import * as date from '@hpapp/foundation/date';
import { Suspense } from 'react';
import { FlatList } from 'react-native';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';

import FeedListItem from './FeedListItem';
import { FeedQuery, HPAssetType } from './__generated__/FeedQuery.graphql';
import { FeedQueryFragmentQuery } from './__generated__/FeedQueryFragmentQuery.graphql';
import { FeedQuery_helloproject_query_feed$key } from './__generated__/FeedQuery_helloproject_query_feed.graphql';

const FeedQueryGraphQL = graphql`
  query FeedQuery($params: HPFeedQueryParamsInput!, $first: Int, $after: Cursor) {
    helloproject {
      ...FeedQuery_helloproject_query_feed
    }
  }
`;

const FeedQueryFragmentGraphQL = graphql`
  fragment FeedQuery_helloproject_query_feed on HelloProjectQuery @refetchable(queryName: "FeedQueryFragmentQuery") {
    feed(params: $params, first: $first, after: $after) @connection(key: "FeedQuery_helloproject_query_feed") {
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
  assetTypes: HPAssetType[];
  numFetch: number;
  memberIds: string[];
  useMemberTaggings: boolean;
};

export default function Feed(props: FeedProps) {
  return (
    <Suspense fallback={<></>}>
      <FeedLoader {...props} />
    </Suspense>
  );
}

function FeedLoader({ numFetch, memberIds, assetTypes, useMemberTaggings }: FeedProps) {
  // TODO: #28 Revisit Tagged Feed Feature
  // We use 30 days window when fetching tagged feed to get the items without timeout.
  // but this prevents users from loading items older than 30 days.
  const minPostAt = useMemberTaggings ? date.addDate(date.getToday().getTime(), 30, 'day').toISOString() : null;
  const data = useLazyLoadQuery<FeedQuery>(FeedQueryGraphQL, {
    first: numFetch,
    params: {
      assetTypes,
      memberIDs: memberIds,
      useMemberTaggings,
      minPostAt
    }
  });
  const fragment = usePaginationFragment<FeedQueryFragmentQuery, FeedQuery_helloproject_query_feed$key>(
    FeedQueryFragmentGraphQL,
    data.helloproject
  );
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
