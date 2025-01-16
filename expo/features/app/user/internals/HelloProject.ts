import { useMemo } from 'react';
import { useFragment, graphql } from 'react-relay';
import { FragmentRefs } from 'relay-runtime';

import {
  HelloProjectFragment$key,
  HelloProjectFragment$data,
  HPFollowHPFollowType
} from './__generated__/HelloProjectFragment.graphql';

const HelloProjectFragmentGraphQL = graphql`
  fragment HelloProjectFragment on HelloProjectQuery {
    artists {
      id
      key
      name
      thumbnailURL
      myFollowStatus {
        id
        type
        elineupmallOther
        elineupmallPhotoDaily
        elineupmallPhotoA4
        elineupmallPhotoA5
        elineupmallPhoto2l
        elineupmallPhotoOther
        elineupmallPhotoAlbum
        elineupmallPhotoAlbumOther
        elineupmallPhotoBook
        elineupmallPhotoBookOther
        elineupmallDvd
        elineupmallDvdMagazine
        elineupmallDvdMagazineOther
        elineupmallBlueray
        elineupmallPenlight
        elineupmallCollectionPinnapPoster
        elineupmallCollectionPhoto
        elineupmallCollectionOther
        elineupmallTshirt
        elineupmallMicrofiberTowel
        elineupmallMufflerTowel
        elineupmallFsk
        elineupmallKeyringOther
        elineupmallClearFile
      }
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
          elineupmallOther
          elineupmallPhotoDaily
          elineupmallPhotoA4
          elineupmallPhotoA5
          elineupmallPhoto2l
          elineupmallPhotoOther
          elineupmallPhotoAlbum
          elineupmallPhotoAlbumOther
          elineupmallPhotoBook
          elineupmallPhotoBookOther
          elineupmallDvd
          elineupmallDvdMagazine
          elineupmallDvdMagazineOther
          elineupmallBlueray
          elineupmallPenlight
          elineupmallCollectionPinnapPoster
          elineupmallCollectionPhoto
          elineupmallCollectionOther
          elineupmallTshirt
          elineupmallMicrofiberTowel
          elineupmallMufflerTowel
          elineupmallFsk
          elineupmallKeyringOther
          elineupmallClearFile
        }
      }
    }
  }
`;

export type HPMember = NonNullable<
  NonNullable<NonNullable<HelloProjectFragment$data['artists']>[number]>['members']
>[number];

export type HPArtist = Omit<NonNullable<NonNullable<HelloProjectFragment$data['artists']>[number]>, 'members'> & {
  members: readonly HPMember[];
};
export type HPFollow = NonNullable<HPArtist['myFollowStatus']>;
export type HPFollowType = HPFollowHPFollowType;

export function useHelloProjectFragment(helloproject: {
  readonly ' $fragmentSpreads': FragmentRefs<'HelloProjectFragment'>;
}): HelloProject {
  const hp = useFragment<HelloProjectFragment$key>(HelloProjectFragmentGraphQL, helloproject);
  return useMemo(() => {
    return new HelloProject(hp);
  }, [hp.artists]);
}

/**
 * A wrapper class for helloproject data set fetched via GraphQL.
 */
export default class HelloProject {
  public readonly artistList: readonly HPArtist[];
  public readonly artistMap: ReadonlyMap<string, HPArtist>;
  public readonly memberList: readonly HPMember[];
  public readonly memberMap: ReadonlyMap<string, HPMember>;
  public readonly created: Date;

  constructor(data: HelloProjectFragment$data) {
    const artistList: HPArtist[] = [];
    const artistMap: Map<string, HPArtist> = new Map();
    const memberList: HPMember[] = [];
    const memberMap: Map<string, HPMember> = new Map();

    data.artists?.forEach((a) => {
      if (a) {
        const members: HPMember[] = [];
        a.members?.forEach((m) => {
          members.push(m);
          memberList.push(m);
          memberMap.set(m.id, m);
        });
        const artist: HPArtist = {
          ...a,
          members
        };
        artistList.push(artist);
        artistMap.set(artist.id, artist);
      }
    });

    this.artistList = artistList;
    this.artistMap = artistMap;
    this.memberList = memberList;
    this.memberMap = memberMap;
    this.created = new Date();
  }
}
