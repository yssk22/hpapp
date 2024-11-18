import { ListItemLoadMore } from '@hpapp/features/common/list';
import { FlatList } from 'react-native';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';

import { ElineupMallLimitedTimeItemListItem } from './ElineupMallLimitedTimeItemListItem';
import { ElineupMallLimitedTimeItemListQuery } from './__generated__/ElineupMallLimitedTimeItemListQuery.graphql';
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
          ...ElineupMallLimitedTimeItemListItemFragment
        }
      }
    }
  }
`;

const numPerFetch = 20;

export type ElineupMallLimitedTimeItemListProps = {
  memberIds: string[];
};

export default function ElineupMallLimitedTimeItemList({ memberIds }: ElineupMallLimitedTimeItemListProps) {
  const data = useLazyLoadQuery<ElineupMallLimitedTimeItemListQuery>(ElineupMallLimitedTimeItemListQueryGraphQL, {
    first: numPerFetch,
    params: {
      memberIDs: memberIds
    }
  });
  const histories = usePaginationFragment<
    ElineupMallLimitedTimeItemListQuery,
    ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items$key
  >(ElineupMallLimitedTimeItemListQueryFragmentGraphQL, data.helloproject);
  return (
    <FlatList
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
