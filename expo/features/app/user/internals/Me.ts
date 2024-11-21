import { HPSortResult } from '@hpapp/features/hpsort';
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
    sortHistories(first: 1) {
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

  public readonly sortResult: HPSortResult | null;

  constructor(me: MeFragment$data) {
    this.id = me.id;
    this.username = me.username;
    this.clientId = me.clientId!;
    this.clientName = me.clientName!;

    const sorts = me?.sortHistories?.edges;
    if (sorts === null || sorts === undefined || sorts.length === 0) {
      this.sortResult = null;
    } else {
      this.sortResult = sorts[0]!
        .node!.sortResult!.records!.filter((r) => r !== null)
        .map((r) => {
          return {
            memberId: r.memberId.toString(),
            previousRank: -1
          };
        });
    }
  }
}
