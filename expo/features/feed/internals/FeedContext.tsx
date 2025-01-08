import * as date from '@hpapp/foundation/date';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchQuery, graphql, usePaginationFragment, useRelayEnvironment } from 'react-relay';
import { usePaginationFragmentHookType } from 'react-relay/relay-hooks/usePaginationFragment';

import { FeedContextQuery, FeedContextQuery$data, HPAssetType } from './__generated__/FeedContextQuery.graphql';
import { FeedContextQueryFragmentQuery } from './__generated__/FeedContextQueryFragmentQuery.graphql';
import {
  FeedContextQuery_helloproject_query_feed$data,
  FeedContextQuery_helloproject_query_feed$key
} from './__generated__/FeedContextQuery_helloproject_query_feed.graphql';

const NUM_FEED_ITEMS_PER_LOAD = 20;

const FeedContextQueryGraphQL = graphql`
  query FeedContextQuery($params: HPFeedQueryParamsInput!, $first: Int, $after: Cursor) {
    helloproject {
      ...FeedContextQuery_helloproject_query_feed
    }
  }
`;

const FeedContextQueryFragmentGraphQL = graphql`
  fragment FeedContextQuery_helloproject_query_feed on HelloProjectQuery
  @refetchable(queryName: "FeedContextQueryFragmentQuery") {
    feed(params: $params, first: $first, after: $after) @connection(key: "FeedContextQuery_helloproject_query_feed") {
      edges {
        node {
          id
          postAt
          myViewHistory {
            id
          }
          ...FeedListItemFragment
        }
      }
    }
  }
`;

type HPFeedItem = NonNullable<
  NonNullable<NonNullable<NonNullable<FeedContextQuery_helloproject_query_feed$data['feed']>['edges']>[number]>['node']
>;

type FeedQueryParams = {
  useMemberTaggings?: boolean;
  memberIDs: string[];
  assetTypes: HPAssetType[];
};

type FeedContextProviderProps = {
  children: React.ReactElement;
} & FeedQueryParams;

type FeedContextModel = {
  data: HPFeedItem[] | null;
  badgeCount: number | undefined;
  isLoading: boolean;
  hasNext: boolean;
  reload: () => void;
  loadNext: () => void;
};

function createFeedContext(): [(props: FeedContextProviderProps) => React.JSX.Element, () => FeedContextModel] {
  const feedContext = createContext<FeedContextModel>({
    data: null,
    badgeCount: 0,
    isLoading: false,
    hasNext: false,
    reload: () => {},
    loadNext: () => {}
  });

  function FeedContextProvider({ children, assetTypes, memberIDs, useMemberTaggings }: FeedContextProviderProps) {
    // TODO: #28 Revisit Tagged Feed Feature
    // We use 30 days window when fetching tagged feed to get the items without timeout.
    // but this prevents users from loading items older than 30 days.
    // const minPostAt = useMemberTaggings
    //   ? date.addDate(date.getToday().getTime(), -1 * DAYS_TO_CALCULATE_MIN_POST_AT_FOR_TAGGEING, 'day').toISOString()
    //   : null;

    // TODO: #52 Revisit the use of Relay and Suspense
    // We currently don't use usePreloadedQuery or useLazyLoadQuery since it causes suspense fallback,
    // which do not support concurrent rendering and it is hard to implement "Pull To Refresh" by VirtualizedList
    // components such as FlatList, SectionList, ...etc.
    // We intentionally use fetchQuery() with 'isLoading' state control for "Pull To Refresh".
    const env = useRelayEnvironment();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<FeedContextQuery$data | null>(null);
    const fetch = useCallback(
      (fetchPolicy: 'store-or-network' | 'network-only') => {
        (async () => {
          setIsLoading(true);
          const result = await fetchQuery<FeedContextQuery>(
            env,
            FeedContextQueryGraphQL,
            {
              first: NUM_FEED_ITEMS_PER_LOAD,
              params: {
                assetTypes,
                memberIDs,
                useMemberTaggings
              }
            },
            {
              fetchPolicy
            }
          ).toPromise();
          setData(result!);
          setIsLoading(false);
        })();
      },
      [env, assetTypes, memberIDs, useMemberTaggings]
    );
    useEffect(() => {
      fetch('store-or-network');
    }, [fetch]);
    const reload = () => {
      fetch('network-only');
    };
    return (
      <FeedContextPaginationRenderer fragment={data} isLoading={isLoading} reload={reload}>
        {children}
      </FeedContextPaginationRenderer>
    );
  }
  function FeedContextPaginationRenderer({
    children,
    isLoading,
    reload,
    fragment
  }: {
    children: React.ReactElement;
    isLoading: boolean;
    reload: () => void;
    fragment: FeedContextQuery$data | null;
  }) {
    const data = usePaginationFragment<FeedContextQueryFragmentQuery, FeedContextQuery_helloproject_query_feed$key>(
      FeedContextQueryFragmentGraphQL,
      fragment?.helloproject ?? null
    );
    return (
      <FeedContextRenderer data={data} isLoading={isLoading} reload={reload}>
        {children}
      </FeedContextRenderer>
    );
  }

  function FeedContextRenderer({
    children,
    isLoading,
    reload,
    data
  }: {
    children: React.ReactElement;
    isLoading: boolean;
    reload: () => void;
    data: usePaginationFragmentHookType<
      FeedContextQueryFragmentQuery,
      FeedContextQuery_helloproject_query_feed$key,
      FeedContextQuery_helloproject_query_feed$data | undefined | null
    >;
  }) {
    const ctxValue = useMemo(() => {
      let badgeCount = undefined;
      const minPostAt = date.addDate(new Date(), -1, 'day');
      if (data?.data?.feed?.edges?.length !== undefined) {
        badgeCount = 0;
        for (let i = 0; i < (data?.data?.feed?.edges?.length ?? 0); i++) {
          const node = data!.data!.feed!.edges![i]!.node!;
          // stop iterating for posts before 24 hours.
          if (new Date(node.postAt).getTime() < minPostAt.getTime()) {
            break;
          }
          if ((node.myViewHistory ?? null) === null) {
            badgeCount++;
          }
        }
      }
      return {
        data: data?.data?.feed?.edges?.map((e) => e!.node!) ?? null,
        badgeCount,
        isLoading,
        hasNext: data?.hasNext ?? false,
        reload,
        loadNext: () => {
          if (data?.hasNext) {
            data.loadNext(NUM_FEED_ITEMS_PER_LOAD);
          }
        }
      };
    }, [data]);
    return <feedContext.Provider value={ctxValue}>{children}</feedContext.Provider>;
  }

  function useFeed() {
    const value = useContext(feedContext);
    return value;
  }

  return [FeedContextProvider, useFeed];
}

export { createFeedContext, HPFeedItem, HPAssetType, FeedContextModel };
