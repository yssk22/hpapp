import { ListItemLoadMore } from '@hpapp/features/common/list';
import { useLazyReloadableQuery } from '@hpapp/system/graphql/hooks';
import { FlatList, RefreshControl } from 'react-native';
import { graphql, usePaginationFragment } from 'react-relay';

import ElineupMallPurchaseHistoryListItem from './ElineupMallPurchaseHistoryListItem';
import { ElineupMallPurchaseHistoryListQuery } from './__generated__/ElineupMallPurchaseHistoryListQuery.graphql';
import { ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories$key } from './__generated__/ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories.graphql';

const ElineupMallPurchaseHistoryListQueryGraphQL = graphql`
  query ElineupMallPurchaseHistoryListQuery($first: Int, $after: Cursor) {
    me {
      ...ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories
    }
  }
`;

const ElineupMallPurchaseHistoryQueryFragmentGraphQL = graphql`
  fragment ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories on MeQuery
  @refetchable(queryName: "ElineupMallPurchaseHistoryListQueryFragmentQuery") {
    elineupMallPurchaseHistories(first: $first, after: $after)
      @connection(key: "ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories") {
      edges {
        node {
          id
          ...ElineupMallPurchaseHistoryListItemFragment
        }
      }
    }
  }
`;

const numPerFetch = 10;

export default function HPElineupMallPurchaseHistory() {
  const { data, isReloading, reload } = useLazyReloadableQuery<ElineupMallPurchaseHistoryListQuery>(
    ElineupMallPurchaseHistoryListQueryGraphQL,
    {
      first: numPerFetch
    }
  );
  const histories = usePaginationFragment<
    ElineupMallPurchaseHistoryListQuery,
    ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories$key
  >(ElineupMallPurchaseHistoryQueryFragmentGraphQL, data.me);
  return (
    <FlatList
      refreshControl={<RefreshControl refreshing={isReloading} onRefresh={reload} />}
      keyExtractor={(item) => item!.node!.id}
      data={histories.data.elineupMallPurchaseHistories?.edges}
      renderItem={({ item, index }) => {
        return <ElineupMallPurchaseHistoryListItem data={item!.node!} />;
      }}
      onEndReachedThreshold={0.01}
      onEndReached={() => {
        histories.loadNext(numPerFetch);
      }}
      ListFooterComponent={histories.hasNext ? <ListItemLoadMore /> : null}
    />
  );
}
