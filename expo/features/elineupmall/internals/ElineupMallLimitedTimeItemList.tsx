import { ListItemLoadMore } from '@hpapp/features/common/list';
import { useLazyReloadableQuery } from '@hpapp/system/graphql/hooks';
import { FlatList, RefreshControl } from 'react-native';
import { graphql, usePaginationFragment } from 'react-relay';

import { ElineupMallLimitedTimeItemListItem } from './ElineupMallLimitedTimeItemListItem';
import { useElineupMall } from './ElineupMallProvider';
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
  artistCategories: {
    artistId: string;
    categories: ElineupMallItemCategory[];
  }[];
  artistIds: string[];
  memberCategories: {
    memberId: string;
    categories: ElineupMallItemCategory[];
  }[];
  memberIds: string[];
  categories: ElineupMallItemCategory[];
};

export default function ElineupMallLimitedTimeItemList({
  artistCategories,
  artistIds,
  memberCategories,
  memberIds,
  categories
}: ElineupMallLimitedTimeItemListProps) {
  const elineupmall = useElineupMall();
  const { data, isReloading, reload } = useLazyReloadableQuery<ElineupMallLimitedTimeItemListQuery>(
    ElineupMallLimitedTimeItemListQueryGraphQL,
    {
      first: numPerFetch,
      params: {
        artistIDs: artistIds,
        artistCategories,
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
      refreshControl={
        <RefreshControl
          refreshing={isReloading}
          onRefresh={() => {
            elineupmall.reload();
            reload();
          }}
        />
      }
      keyExtractor={(item) => item!.node!.id}
      data={histories.data.elineupMallItems!.edges}
      renderItem={({ item, index }) => {
        return <ElineupMallLimitedTimeItemListItem data={item!.node!} />;
      }}
      onEndReachedThreshold={0.01}
      onEndReached={() => {
        histories.loadNext(numPerFetch);
      }}
      ListFooterComponent={histories.hasNext ? <ListItemLoadMore /> : null}
    />
  );
}
