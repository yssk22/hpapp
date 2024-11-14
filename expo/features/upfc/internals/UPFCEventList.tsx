import { ListItemLoadMore } from '@hpapp/features/common/list';
import { parseDate } from '@hpapp/foundation/date';
import { FlatList } from 'react-native';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';

import UPFCEventListItem from './UPFCEventListItem';
import { UPFCEventListQuery } from './__generated__/UPFCEventListQuery.graphql';
import { UPFCEventListQuery_me_query_events$key } from './__generated__/UPFCEventListQuery_me_query_events.graphql';

const UPFCEventListQueryGraphQL = graphql`
  query UPFCEventListQuery($first: Int, $after: Cursor) {
    me {
      ...UPFCEventListQuery_me_query_events
    }
  }
`;

const HPSortHistoryListQueryFragmentGraphQL = graphql`
  fragment UPFCEventListQuery_me_query_events on MeQuery @refetchable(queryName: "UPFCEventListQueryFragmentQuery") {
    events(first: $first, after: $after) @connection(key: "UPFCEventListQuery_me_query_events") {
      edges {
        node {
          id
          key
          displayTitles
          openAt
          startAt
          venue
          prefecture
          tickets {
            applicationTitle
            num
            status
          }
        }
      }
    }
  }
`;

const numPerFetch = 20;

export default function UPFCEventList() {
  const data = useLazyLoadQuery<UPFCEventListQuery>(UPFCEventListQueryGraphQL, {
    first: numPerFetch
  });
  const histories = usePaginationFragment<UPFCEventListQuery, UPFCEventListQuery_me_query_events$key>(
    HPSortHistoryListQueryFragmentGraphQL,
    data.me
  );
  return (
    <FlatList
      keyExtractor={(item) => item!.node!.id}
      data={histories.data.events!.edges}
      renderItem={({ item, index }) => {
        const tickets = item!.node!.tickets!.map((t) => t.applicationTitle);
        return (
          <UPFCEventListItem
            name={tickets[0]}
            venue={item!.node!.venue!}
            startAt={parseDate(item!.node!.startAt)}
            openAt={parseDate(item!.node!.openAt)}
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
