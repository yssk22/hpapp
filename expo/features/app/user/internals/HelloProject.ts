import { useMemo } from 'react';
import { useFragment, graphql } from 'react-relay';
import { FragmentRefs } from 'relay-runtime';

import {
  HelloProjectFragment$key,
  HelloProjectFragment$data,
  HPFollowHPFollowType
} from './__generated__/HelloProjectFragment.graphql';

const helloProjectFragmentGraphQL = graphql`
  fragment HelloProjectFragment on HelloProjectQuery {
    artists {
      id
      key
      name
      thumbnailURL
      members {
        id
        key
        artistKey
        artistID
        name
        nameKana
        thumbnailURL
        dateOfBirth
        bloodType
        joinAt
        graduateAt
        myFollowStatus {
          id
          type
        }
      }
    }
  }
`;

export function useHelloProjectFragment(helloproject: {
  readonly ' $fragmentSpreads': FragmentRefs<'HelloProjectFragment'>;
}) {
  const hp = useFragment<HelloProjectFragment$key>(helloProjectFragmentGraphQL, helloproject);
  return useMemo(() => {
    return new HelloProject(hp.artists as readonly HPArtist[]);
  }, [hp.artists]);
}

export type HPArtist = NonNullable<NonNullable<HelloProjectFragment$data['artists']>[number]>;
export type HPMember = NonNullable<HPArtist['members']>[0];
export type HPFollowType = HPFollowHPFollowType;

/**
 * A wrapper class for helloproject data set fetched via GraphQL.
 */
export default class HelloProject {
  private artistList: readonly HPArtist[];
  private artistMap: ReadonlyMap<string, HPArtist>;
  private memberList: readonly HPMember[];
  private memberMap: ReadonlyMap<string, HPMember>;

  constructor(data: readonly HPArtist[]) {
    this.artistList = data;
    const artistMap = new Map<string, HPArtist>();
    const memberList = new Array<HPMember>();
    const memberMap = new Map<string, HPMember>();
    for (const item of this.artistList) {
      artistMap.set(item.id, item);
      for (const member of item.members ?? []) {
        memberList.push(member);
        memberMap.set(member.id, member);
      }
    }
    this.artistMap = artistMap;
    this.memberList = memberList;
    this.memberMap = memberMap;
  }

  public useArtists(includeOG: boolean = false) {
    // FIXME:
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const list = useMemo(() => {
      if (includeOG) {
        return this.artistList;
      }
      return this.artistList.filter((a) => {
        const activeMembers = (a.members ?? [])?.filter((m) => {
          return m.graduateAt === null;
        });
        return activeMembers.length > 0;
      });
    }, [this.artistList, includeOG]);
    return list;
  }

  public useArtist(id: string): HPArtist | undefined {
    return this.artistMap.get(id);
  }

  public useMembers(includeOG: boolean = false) {
    if (includeOG) {
      return this.memberList;
    }
    return this.memberList.filter((m) => {
      return m.graduateAt === null;
    });
  }

  public useFollowingMembers(includeOG: boolean = false) {
    return this.useMembers(includeOG).filter((m) => {
      return m.myFollowStatus?.type === 'follow' || m.myFollowStatus?.type === 'follow_with_notification';
    });
  }

  public useMember(member: HPMember | string): HPMember | undefined {
    if (typeof member !== 'string') {
      return member;
    }
    return this.memberMap.get(member);
  }
}
