/**
 * @generated SignedSource<<d380511006f2915b9d00ff88720fa2a1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type HPFollowHPFollowType = "follow" | "follow_with_notification" | "unfollow" | "unknown" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type HelloProjectFragment$data = {
  readonly artists: ReadonlyArray<{
    readonly id: string;
    readonly key: string;
    readonly members: ReadonlyArray<{
      readonly artistID: string | null | undefined;
      readonly artistKey: string;
      readonly bloodType: string;
      readonly dateOfBirth: string;
      readonly graduateAt: string | null | undefined;
      readonly id: string;
      readonly joinAt: string | null | undefined;
      readonly key: string;
      readonly myFollowStatus: {
        readonly elineupmallBlueray: HPFollowHPFollowType;
        readonly elineupmallClearFile: HPFollowHPFollowType;
        readonly elineupmallCollectionOther: HPFollowHPFollowType;
        readonly elineupmallCollectionPhoto: HPFollowHPFollowType;
        readonly elineupmallCollectionPinnapPoster: HPFollowHPFollowType;
        readonly elineupmallDvd: HPFollowHPFollowType;
        readonly elineupmallDvdMagazine: HPFollowHPFollowType;
        readonly elineupmallDvdMagazineOther: HPFollowHPFollowType;
        readonly elineupmallFsk: HPFollowHPFollowType;
        readonly elineupmallKeyringOther: HPFollowHPFollowType;
        readonly elineupmallMicrofiberTowel: HPFollowHPFollowType;
        readonly elineupmallMufflerTowel: HPFollowHPFollowType;
        readonly elineupmallOther: HPFollowHPFollowType;
        readonly elineupmallPenlight: HPFollowHPFollowType;
        readonly elineupmallPhoto2l: HPFollowHPFollowType;
        readonly elineupmallPhotoA4: HPFollowHPFollowType;
        readonly elineupmallPhotoA5: HPFollowHPFollowType;
        readonly elineupmallPhotoAlbum: HPFollowHPFollowType;
        readonly elineupmallPhotoAlbumOther: HPFollowHPFollowType;
        readonly elineupmallPhotoBook: HPFollowHPFollowType;
        readonly elineupmallPhotoBookOther: HPFollowHPFollowType;
        readonly elineupmallPhotoDaily: HPFollowHPFollowType;
        readonly elineupmallPhotoOther: HPFollowHPFollowType;
        readonly elineupmallTshirt: HPFollowHPFollowType;
        readonly id: string;
        readonly type: HPFollowHPFollowType;
      } | null | undefined;
      readonly name: string;
      readonly nameKana: string;
      readonly thumbnailURL: string;
    }> | null | undefined;
    readonly myFollowStatus: {
      readonly elineupmallBlueray: HPFollowHPFollowType;
      readonly elineupmallClearFile: HPFollowHPFollowType;
      readonly elineupmallCollectionOther: HPFollowHPFollowType;
      readonly elineupmallCollectionPhoto: HPFollowHPFollowType;
      readonly elineupmallCollectionPinnapPoster: HPFollowHPFollowType;
      readonly elineupmallDvd: HPFollowHPFollowType;
      readonly elineupmallDvdMagazine: HPFollowHPFollowType;
      readonly elineupmallDvdMagazineOther: HPFollowHPFollowType;
      readonly elineupmallFsk: HPFollowHPFollowType;
      readonly elineupmallKeyringOther: HPFollowHPFollowType;
      readonly elineupmallMicrofiberTowel: HPFollowHPFollowType;
      readonly elineupmallMufflerTowel: HPFollowHPFollowType;
      readonly elineupmallOther: HPFollowHPFollowType;
      readonly elineupmallPenlight: HPFollowHPFollowType;
      readonly elineupmallPhoto2l: HPFollowHPFollowType;
      readonly elineupmallPhotoA4: HPFollowHPFollowType;
      readonly elineupmallPhotoA5: HPFollowHPFollowType;
      readonly elineupmallPhotoAlbum: HPFollowHPFollowType;
      readonly elineupmallPhotoAlbumOther: HPFollowHPFollowType;
      readonly elineupmallPhotoBook: HPFollowHPFollowType;
      readonly elineupmallPhotoBookOther: HPFollowHPFollowType;
      readonly elineupmallPhotoDaily: HPFollowHPFollowType;
      readonly elineupmallPhotoOther: HPFollowHPFollowType;
      readonly elineupmallTshirt: HPFollowHPFollowType;
      readonly id: string;
      readonly type: HPFollowHPFollowType;
    } | null | undefined;
    readonly name: string;
    readonly thumbnailURL: string;
  } | null | undefined> | null | undefined;
  readonly " $fragmentType": "HelloProjectFragment";
};
export type HelloProjectFragment$key = {
  readonly " $data"?: HelloProjectFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"HelloProjectFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "thumbnailURL",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "HPFollow",
  "kind": "LinkedField",
  "name": "myFollowStatus",
  "plural": false,
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallOther",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhotoDaily",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhotoA4",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhotoA5",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhoto2l",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhotoOther",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhotoAlbum",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhotoAlbumOther",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhotoBook",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPhotoBookOther",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallDvd",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallDvdMagazine",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallDvdMagazineOther",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallBlueray",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallPenlight",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallCollectionPinnapPoster",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallCollectionPhoto",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallCollectionOther",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallTshirt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallMicrofiberTowel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallMufflerTowel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallFsk",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallKeyringOther",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "elineupmallClearFile",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HelloProjectFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "HPArtist",
      "kind": "LinkedField",
      "name": "artists",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "HPMember",
          "kind": "LinkedField",
          "name": "members",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "artistKey",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "artistID",
              "storageKey": null
            },
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "nameKana",
              "storageKey": null
            },
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "dateOfBirth",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "bloodType",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "joinAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "graduateAt",
              "storageKey": null
            },
            (v4/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HelloProjectQuery",
  "abstractKey": null
};
})();

(node as any).hash = "a5a1b60d4bee78771034ffdc410a2c8a";

export default node;
