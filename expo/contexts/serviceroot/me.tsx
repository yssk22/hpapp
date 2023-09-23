import { graphql, useFragment } from "react-relay";
import { FragmentRefs } from "relay-runtime";
import {
  meFragment$key,
  meFragment$data,
  HPFollowHPFollowType,
} from "@hpapp/contexts/serviceroot/__generated__/meFragment.graphql";
import { useMemo } from "react";
import { HPMember } from "@hpapp/contexts/serviceroot/helloproject";

const meFragmentGraphQL = graphql`
  fragment meFragment on MeQuery {
    id
    username
    clientId
    clientName
    followings {
      type
      member {
        id
      }
    }
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

type SortResult = Array<{
  memberId: string;
  previousRank?: number;
}>;

type HPFollowType = HPFollowHPFollowType;

type HPFollow = {
  type: HPFollowType;
  memberId: string;
};

// Me class implements a logic to use user data stored on the server.
class Me {
  public readonly id: string;
  public readonly username: string;
  public readonly clientId: string;
  public readonly clientName: string;

  public readonly followings: Array<HPFollow>;
  private readonly followingsMap: Map<string, HPFollow>;

  public readonly sortResult: SortResult | null;

  constructor(me: meFragment$data) {
    this.id = me.id;
    this.username = me.username;
    this.clientId = me.clientId!;
    this.clientName = me.clientName!;

    this.followings = me!
      .followings!.filter((f) => f?.member !== undefined)
      .map((f) => {
        return {
          type: f!.type,
          memberId: f!.member.id,
        };
      });
    this.followingsMap = this.followings.reduce((a, v) => {
      a.set(v.memberId, v);
      return a;
    }, new Map<string, HPFollow>());

    const sorts = me?.sortHistories?.edges;
    if (sorts === null || sorts === undefined || sorts.length === 0) {
      this.sortResult = null;
    } else {
      this.sortResult = sorts[0]!
        .node!.sortResult!.records!.filter((r) => r !== null)
        .map((r) => {
          return {
            memberId: r.memberId.toString(),
            previousRank: -1,
          };
        });
    }
  }

  public useFollowType(memberId: string) {
    const follow = this.followingsMap.get(memberId);
    return follow?.type || "unfollow";
  }
}

function useMeFragment(me: {
  readonly " $fragmentSpreads": FragmentRefs<"meFragment">;
}) {
  const me$ = useFragment<meFragment$key>(meFragmentGraphQL, me);
  return useMemo(() => {
    return new Me(me$);
  }, [me$]);
}

export { useMeFragment, Me, HPFollowType, HPFollow, SortResult };
