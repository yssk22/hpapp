/**
 * @generated SignedSource<<a56a13f77ea2ddcaa1c45e19a64a968a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HPElineupMallItemCategory = "blueray" | "clear_file" | "colllection_other" | "colllection_photo" | "colllection_pinnap_poster" | "dvd" | "dvd_magazine" | "dvd_magazine_other" | "fsk" | "keyring_other" | "microfiber_towel" | "muffler_towel" | "other" | "penlight" | "photo2_l" | "photo_a4" | "photo_a5" | "photo_album" | "photo_album_other" | "photo_book" | "photo_book_other" | "photo_daily" | "photo_other" | "t_shirt" | "%future added value";
export type HPFollowHPFollowType = "follow" | "follow_with_notification" | "unfollow" | "unknown" | "%future added value";
export type HPFollowType = "follow" | "follow_with_notification" | "unfollow" | "unknown" | "%future added value";
export type HPFollowUpsertParamsInput = {
  artistId?: number | null | undefined;
  elineupMallFollowParams?: ReadonlyArray<HPFollowElineupMallParamsInput> | null | undefined;
  followType: HPFollowType;
  memberId?: number | null | undefined;
};
export type HPFollowElineupMallParamsInput = {
  category: HPElineupMallItemCategory;
  followType: HPFollowType;
};
export type useUpsertFollowMutation$variables = {
  params: HPFollowUpsertParamsInput;
};
export type useUpsertFollowMutation$data = {
  readonly me: {
    readonly upsertFollow: {
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
      readonly member: {
        readonly id: string;
      } | null | undefined;
      readonly type: HPFollowHPFollowType;
    } | null | undefined;
  } | null | undefined;
};
export type useUpsertFollowMutation = {
  response: useUpsertFollowMutation$data;
  variables: useUpsertFollowMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "params"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "MeMutation",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "params",
            "variableName": "params"
          }
        ],
        "concreteType": "HPFollow",
        "kind": "LinkedField",
        "name": "upsertFollow",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
            "concreteType": "HPMember",
            "kind": "LinkedField",
            "name": "member",
            "plural": false,
            "selections": [
              (v1/*: any*/)
            ],
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
            "name": "elineupmallClearFile",
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
            "name": "elineupmallOther",
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
            "name": "elineupmallTshirt",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useUpsertFollowMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUpsertFollowMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "357754e0f499a9fcc492f37e71ef1677",
    "id": null,
    "metadata": {},
    "name": "useUpsertFollowMutation",
    "operationKind": "mutation",
    "text": "mutation useUpsertFollowMutation(\n  $params: HPFollowUpsertParamsInput!\n) {\n  me {\n    upsertFollow(params: $params) {\n      id\n      type\n      member {\n        id\n      }\n      elineupmallBlueray\n      elineupmallClearFile\n      elineupmallCollectionOther\n      elineupmallCollectionPinnapPoster\n      elineupmallCollectionPhoto\n      elineupmallDvd\n      elineupmallDvdMagazine\n      elineupmallDvdMagazineOther\n      elineupmallFsk\n      elineupmallKeyringOther\n      elineupmallMicrofiberTowel\n      elineupmallMufflerTowel\n      elineupmallOther\n      elineupmallPenlight\n      elineupmallPhotoDaily\n      elineupmallPhotoA4\n      elineupmallPhotoA5\n      elineupmallPhoto2l\n      elineupmallPhotoOther\n      elineupmallPhotoAlbum\n      elineupmallPhotoAlbumOther\n      elineupmallPhotoBook\n      elineupmallPhotoBookOther\n      elineupmallTshirt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "494dba2fd4a8389f13bc1168905e4855";

export default node;
