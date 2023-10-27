import { FeedQuery, HPAssetType } from '@hpapp/features/feed/__generated__/FeedQuery.graphql';
import { FeedQueryFragmentQuery } from '@hpapp/features/feed/__generated__/FeedQueryFragmentQuery.graphql';
import { FeedQuery_helloproject_query_feed$key } from '@hpapp/features/feed/__generated__/FeedQuery_helloproject_query_feed.graphql';
import * as date from '@hpapp/foundation/date';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';

const useFeedQueryGraphQL = graphql`
  query useFeedFeedQuery($params: HPFeedQueryParamsInput!, $first: Int, $after: Cursor) {
    helloproject {
      ...useFeedQuery_helloproject_query_feed
    }
  }
`;

const FeedQueryFragmentGraphQL = graphql`
  fragment useFeedQuery_helloproject_query_feed on HelloProjectQuery
  @refetchable(queryName: "useFeedQueryFragmentQuery") {
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

const minPostAtForTaggedFeed = 3 * date.N_DAYS;

export default function useFeed({ numFetch, memberIds, assetTypes, useMemberTaggings }: FeedProps) {
  // TODO: #28 Revisit Tagged Feed Feature
  // We use 30 days window when fetching tagged feed to get the items without timeout.
  // but this prevents users from loading items older than 30 days.
  const minPostAt = useMemberTaggings
    ? new Date(date.getToday().getTime() - minPostAtForTaggedFeed).toISOString()
    : null;
  const data = useLazyLoadQuery<FeedQuery>(useFeedQueryGraphQL, {
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
  return fragment;
}
