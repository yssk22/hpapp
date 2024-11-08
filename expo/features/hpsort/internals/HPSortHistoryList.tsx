import { ListItemLoadMore } from '@hpapp/features/common/list';
import { FlatList } from 'react-native';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';

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
            }
          }
        }
      }
    }
  }
`;

/**
 * TODO: #103 optimize and fix the logic for HPSortHistoryScreen.
 */
const numPerFetch = 30;

export default function HPSortHistoryList() {
  const data = useLazyLoadQuery<HPSortHistoryListQuery>(HPSortHistoryListQueryGraphQL, {
    first: numPerFetch
  });
  const histories = usePaginationFragment<HPSortHistoryListQuery, HPSortHistoryListQuery_me_query_sortHistories$key>(
    HPSortHistoryListQueryFragmentGraphQL,
    data.me
  );
  return (
    <FlatList
      keyExtractor={(item) => item!.node!.id}
      data={histories.data.sortHistories!.edges}
      renderItem={({ item, index }) => {
        if (index === histories.data.sortHistories!.edges!.length - 1) {
          return (
            <HPSortHistoryListItem
              current={{
                memberIds: item!.node!.sortResult.records!.map((r) => r.memberId.toString())
              }}
              createdAt={item!.node!.createdAt!}
            />
          );
        }
        return (
          <HPSortHistoryListItem
            current={{
              memberIds: item!.node!.sortResult.records!.map((r) => r.memberId.toString())
            }}
            previous={{
              memberIds: (histories.data.sortHistories!.edges![index + 1]!.node!.sortResult!.records ?? []).map((r) =>
                r.memberId.toString()
              )
            }}
            createdAt={item!.node!.createdAt!}
          />
        );
      }}
      onEndReachedThreshold={0.01}
      onEndReached={() => {
        /**
         * TODO: #103 optimize and fix the logic for HPSortHistoryScreen.
         */
        histories.loadNext(numPerFetch);
      }}
      ListFooterComponent={histories.hasNext ? <ListItemLoadMore /> : null}
    />
  );
}
