import { ListItemLoadMore } from '@hpapp/features/common/list';
import { ElineupMallPurchaseHistoryItem } from '@hpapp/features/elineupmall/scraper';
import { useLazyReloadableQuery } from '@hpapp/system/graphql/hooks';
import { FlatList, RefreshControl } from 'react-native';
import { graphql, usePaginationFragment } from 'react-relay';

import { ElineupMallLimitedTimeItemListItem } from './ElineupMallLimitedTimeItemListItem';
import {
  ElineupMallLimitedTimeItemListQuery,
  HPElineupMallItemCategory
} from './__generated__/ElineupMallLimitedTimeItemListQuery.graphql';
import { ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items$key } from './__generated__/ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items.graphql';

const ElineupMallLimitedTimeItemListQueryGraphQL = graphql`
  query ElineupMallLimitedTimeItemListQuery($first: Int, $after: Cursor, $params: HPElineumpMallItemsParamsInput!) {
    helloproject {
      ...ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items
    }
  }
`;

const ElineupMallLimitedTimeItemListQueryFragmentGraphQL = graphql`
  fragment ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items on HelloProjectQuery
  @refetchable(queryName: "ElineupMallLimitedTimeItemListQueryFragmentQuery") {
    elineupMallItems(first: $first, after: $after, params: $params)
      @connection(key: "ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupMallItems") {
      edges {
        node {
          id
          permalink
          ...ElineupMallLimitedTimeItemListItemFragment
        }
      }
    }
  }
`;

const numPerFetch = 20;

export type ElineupMallItemCategory = HPElineupMallItemCategory;

export type ElineupMallLimitedTimeItemListProps = {
  memberCategories: {
    memberId: string;
    categories: ElineupMallItemCategory[];
  }[];
  memberIds: string[];
  categories: ElineupMallItemCategory[];
  historyMap?: Map<string, ElineupMallPurchaseHistoryItem>;
};

export default function ElineupMallLimitedTimeItemList({
  memberCategories,
  memberIds,
  categories,
  historyMap
}: ElineupMallLimitedTimeItemListProps) {
  const { data, isReloading, reload } = useLazyReloadableQuery<ElineupMallLimitedTimeItemListQuery>(
    ElineupMallLimitedTimeItemListQueryGraphQL,
    {
      first: numPerFetch,
      params: {
        memberIDs: memberIds,
        categories,
        memberCategories
      }
    }
  );
  const histories = usePaginationFragment<
    ElineupMallLimitedTimeItemListQuery,
    ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items$key
  >(ElineupMallLimitedTimeItemListQueryFragmentGraphQL, data.helloproject);
  return (
    <FlatList
      refreshControl={<RefreshControl refreshing={isReloading} onRefresh={reload} />}
      keyExtractor={(item) => item!.node!.id}
      data={histories.data.elineupMallItems!.edges}
      renderItem={({ item, index }) => {
        const historyItem = historyMap?.get(item?.node?.permalink ?? '');
        return <ElineupMallLimitedTimeItemListItem data={item!.node!} purchaseHistoryItem={historyItem} />;
      }}
      onEndReachedThreshold={0.01}
      onEndReached={() => {
        histories.loadNext(numPerFetch);
      }}
      ListFooterComponent={histories.hasNext ? <ListItemLoadMore /> : null}
    />
  );
}
