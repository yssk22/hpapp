import { compareMemberRankDiff, HPSortResultMemberRank, sortRecordsToMemberRank } from '@hpapp/features/hpsort/helper';
import { useMemo } from 'react';
import { useFragment, graphql } from 'react-relay';
import { FragmentRefs } from 'relay-runtime';

import { MeFragment$data, MeFragment$key } from './__generated__/MeFragment.graphql';

const meFragmentGraphQL = graphql`
  fragment MeFragment on MeQuery {
    id
    username
    clientId
    clientName
    sortHistories(first: 2) {
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

export function useMeFragment(me: { readonly ' $fragmentSpreads': FragmentRefs<'MeFragment'> }) {
  const me$ = useFragment<MeFragment$key>(meFragmentGraphQL, me);
  return useMemo(() => {
    return new Me(me$);
  }, [me$]);
}

// Me class implements a logic to use user data stored on the server.
export default class Me {
  public readonly id: string;
  public readonly username: string;
  public readonly clientId: string;
  public readonly clientName: string;

  public readonly latestSortReult: HPSortResultMemberRank[] | null;

  constructor(me: MeFragment$data) {
    this.id = me.id;
    this.username = me.username;
    this.clientId = me.clientId!;
    this.clientName = me.clientName!;

    const sorts = me?.sortHistories?.edges;
    if (sorts === null || sorts === undefined || sorts.length === 0) {
      this.latestSortReult = null;
    } else {
      this.latestSortReult = sortRecordsToMemberRank(sorts[0]!.node!.sortResult!.records!);
      if (sorts.length === 2) {
        const previous = sortRecordsToMemberRank(sorts[1]!.node!.sortResult!.records!);
        this.latestSortReult = compareMemberRankDiff(this.latestSortReult, previous);
      }
    }
  }
}
