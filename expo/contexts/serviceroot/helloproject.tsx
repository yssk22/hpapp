import {
  helloprojectFragment$data,
  helloprojectFragment$key,
} from "@hpapp/contexts/serviceroot/__generated__/helloprojectFragment.graphql";
import { useMemo } from "react";
import { graphql, useFragment } from "react-relay";
import { FragmentRefs } from "relay-runtime";
import { ReadonlyESMap } from "typescript";

const helloprojectFragmentGraphQl = graphql`
  fragment helloprojectFragment on HelloProjectQuery {
    artists {
      id
      key
      name
      thumbnailURL
      members {
        id
        key
        artistKey
        name
        nameKana
        thumbnailURL
        dateOfBirth
        bloodType
        joinAt
        graduateAt
      }
    }
  }
`;

export type HPArtist = NonNullable<
  NonNullable<helloprojectFragment$data["artists"]>[number]
>;
export type HPMember = NonNullable<HPArtist["members"]>[0];

function useHelloprojectFragment(helloproject: {
  readonly " $fragmentSpreads": FragmentRefs<"helloprojectFragment">;
}) {
  const hp = useFragment<helloprojectFragment$key>(
    helloprojectFragmentGraphQl,
    helloproject
  );
  return useMemo(() => {
    return new HelloProject(hp.artists as ReadonlyArray<HPArtist>);
  }, [hp.artists]);
}

interface HelloProject {
  useArtists(includeOG?: boolean): ReadonlyArray<HPArtist>;
  useArtist(id: string): HPArtist | undefined;
  useMembers(includeOG?: boolean): ReadonlyArray<HPMember>;
  useMember(member: HPMember | string): HPMember | undefined;
}

// HelloProject class implements a logic to use helloproject data
class HelloProject implements HelloProject {
  private artistList: ReadonlyArray<HPArtist>;
  private artistMap: ReadonlyESMap<string, HPArtist>;
  private memberList: ReadonlyArray<HPMember>;
  private memberMap: ReadonlyESMap<string, HPMember>;

  constructor(data: ReadonlyArray<HPArtist>) {
    this.artistList = data;
    const artistMap = new Map<string, HPArtist>();
    const memberList = new Array<HPMember>();
    const memberMap = new Map<string, HPMember>();
    for (const item of this.artistList) {
      artistMap.set(item.id, item);
      for (const member of item.members || []) {
        memberList.push(member);
        memberMap.set(member.id, member);
      }
    }
    this.artistMap = artistMap;
    this.memberList = memberList;
    this.memberMap = memberMap;
  }

  public useArtists(includeOG: boolean = false) {
    const list = useMemo(() => {
      if (includeOG) {
        return this.artistList;
      }
      return this.artistList.filter((a) => {
        const activeMembers = (a.members || [])?.filter((m) => {
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

  public useMember(member: HPMember | string): HPMember | undefined {
    if (typeof member !== "string") {
      return member;
    }
    return this.memberMap.get(member);
  }
}

export { useHelloprojectFragment, HelloProject };
