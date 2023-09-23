import {
  graphql,
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { HPFeedQueryParamsInput } from "@hpapp/features/feed/__generated__/useFeedItemsQuery.graphql";

const FeedPaginationQuery = graphql`
  query useFeedItemsQuery(
    $params: HPFeedQueryParamsInput!
    $first: Int
    $after: Cursor
  ) {
    helloproject {
      feed(params: $params, first: $first, after: $after) {
        edges {
          node {
            id
            sourceID
            title
            sourceURL
            imageURL
            assetType
            postAt
            ownerMember {
              id
              key
            }
            taggedMembers {
              id
              key
            }
            myViewHistory {
              id
              isFavorite
            }
          }
        }
      }
    }
  }
`;

function useFeedItems(params: HPFeedQueryParamsInput) {}

export default useFeedItems;
