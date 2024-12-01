import { ListItemLoadMore } from '@hpapp/features/common/list';
import { sortRecordsToMemberRank } from '@hpapp/features/hpsort/helper';
import { useLazyReloadableQuery } from '@hpapp/system/graphql/hooks';
import { FlatList, RefreshControl } from 'react-native';
import { graphql, usePaginationFragment } from 'react-relay';

import HPSortHistoryListItem from './HPSortHistoryListItem';
import { HPSortHistoryListQuery } from './__generated__/HPSortHistoryListQuery.graphql';
import { HPSortHistoryListQuery_me_query_sortHistories$key } from './__generated__/HPSortHistoryListQuery_me_query_sortHistories.graphql';

const HPSortHistoryListQueryGraphQL = graphql`
  query HPSortHistoryListQuery($first: Int, $after: Cursor) {
    me {
      ...HPSortHistoryListQuery_me_query_sortHistories
    }
  }
`;

const HPSortHistoryListQueryFragmentGraphQL = graphql`
  fragment HPSortHistoryListQuery_me_query_sortHistories on MeQuery
  @refetchable(queryName: "HPSortHistoryListQueryFragmentQuery") {
    sortHistories(first: $first, after: $after) @connection(key: "HPSortHistoryListQuery_me_query_sortHistories") {
      edges {
        node {
          id
          createdAt
          sortResult {
            records {
              artistId
              memberId
              memberKey
              point
              rank
            }
          }
        }
      }
    }
  }
`;

const numPerFetch = 10;

export default function HPSortHistoryList() {
  const { data, isReloading, reload } = useLazyReloadableQuery<HPSortHistoryListQuery>(HPSortHistoryListQueryGraphQL, {
    first: numPerFetch
  });
  const histories = usePaginationFragment<HPSortHistoryListQuery, HPSortHistoryListQuery_me_query_sortHistories$key>(
    HPSortHistoryListQueryFragmentGraphQL,
    data.me
  );
  return (
    <FlatList
      refreshControl={<RefreshControl refreshing={isReloading} onRefresh={reload} />}
      keyExtractor={(item) => item!.node!.id}
      data={histories.data.sortHistories!.edges}
      renderItem={({ item, index }) => {
        if (index === histories.data.sortHistories!.edges!.length - 1) {
          return (
            <HPSortHistoryListItem
              current={sortRecordsToMemberRank(item!.node!.sortResult.records!)}
              createdAt={item!.node!.createdAt!}
            />
          );
        }
        return (
          <HPSortHistoryListItem
            current={sortRecordsToMemberRank(item!.node!.sortResult.records!)}
            previous={sortRecordsToMemberRank(
              histories.data.sortHistories!.edges![index + 1]!.node!.sortResult!.records ?? []
            )}
            createdAt={item!.node!.createdAt!}
          />
        );
      }}
      onEndReachedThreshold={0.01}
      onEndReached={() => {
        histories.loadNext(numPerFetch);
      }}
      ListFooterComponent={histories.hasNext ? <ListItemLoadMore /> : null}
    />
  );
}
