/**
 * @generated SignedSource<<68a5af8a866b4d0c3785daaea82b91ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UserServiceProviderQuery$variables = Record<PropertyKey, never>;
export type UserServiceProviderQuery$data = {
  readonly helloproject: {
    readonly " $fragmentSpreads": FragmentRefs<"HelloProjectFragment">;
  };
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"MeFragment">;
  };
};
export type UserServiceProviderQuery = {
  response: UserServiceProviderQuery$data;
  variables: UserServiceProviderQuery$variables;
};

const node: ConcreteRequest = (function(){
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
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "UserServiceProviderQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "HelloProjectQuery",
        "kind": "LinkedField",
        "name": "helloproject",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "HelloProjectFragment"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "MeQuery",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MeFragment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UserServiceProviderQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "HelloProjectQuery",
        "kind": "LinkedField",
        "name": "helloproject",
        "plural": false,
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
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "MeQuery",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "username",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "clientId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "clientName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 2
              }
            ],
            "concreteType": "HPSortHistoryConnection",
            "kind": "LinkedField",
            "name": "sortHistories",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "HPSortHistoryEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "HPSortHistory",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "createdAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "HPSortResult",
                        "kind": "LinkedField",
                        "name": "sortResult",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "HPSortResultRecord",
                            "kind": "LinkedField",
                            "name": "records",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "artistId",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "memberId",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "memberKey",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "point",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "rank",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "sortHistories(first:2)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0c0e84b9a13170b8ec80bf5216a13d6a",
    "id": null,
    "metadata": {},
    "name": "UserServiceProviderQuery",
    "operationKind": "query",
    "text": "query UserServiceProviderQuery {\n  helloproject {\n    ...HelloProjectFragment\n    id\n  }\n  me {\n    ...MeFragment\n    id\n  }\n}\n\nfragment HelloProjectFragment on HelloProjectQuery {\n  artists {\n    id\n    key\n    name\n    thumbnailURL\n    myFollowStatus {\n      id\n      type\n      elineupmallOther\n      elineupmallPhotoDaily\n      elineupmallPhotoA4\n      elineupmallPhotoA5\n      elineupmallPhoto2l\n      elineupmallPhotoOther\n      elineupmallPhotoAlbum\n      elineupmallPhotoAlbumOther\n      elineupmallPhotoBook\n      elineupmallPhotoBookOther\n      elineupmallDvd\n      elineupmallDvdMagazine\n      elineupmallDvdMagazineOther\n      elineupmallBlueray\n      elineupmallPenlight\n      elineupmallCollectionPinnapPoster\n      elineupmallCollectionPhoto\n      elineupmallCollectionOther\n      elineupmallTshirt\n      elineupmallMicrofiberTowel\n      elineupmallMufflerTowel\n      elineupmallFsk\n      elineupmallKeyringOther\n      elineupmallClearFile\n    }\n    members {\n      id\n      key\n      artistKey\n      artistID\n      name\n      nameKana\n      thumbnailURL\n      dateOfBirth\n      bloodType\n      joinAt\n      graduateAt\n      myFollowStatus {\n        id\n        type\n        elineupmallOther\n        elineupmallPhotoDaily\n        elineupmallPhotoA4\n        elineupmallPhotoA5\n        elineupmallPhoto2l\n        elineupmallPhotoOther\n        elineupmallPhotoAlbum\n        elineupmallPhotoAlbumOther\n        elineupmallPhotoBook\n        elineupmallPhotoBookOther\n        elineupmallDvd\n        elineupmallDvdMagazine\n        elineupmallDvdMagazineOther\n        elineupmallBlueray\n        elineupmallPenlight\n        elineupmallCollectionPinnapPoster\n        elineupmallCollectionPhoto\n        elineupmallCollectionOther\n        elineupmallTshirt\n        elineupmallMicrofiberTowel\n        elineupmallMufflerTowel\n        elineupmallFsk\n        elineupmallKeyringOther\n        elineupmallClearFile\n      }\n    }\n  }\n}\n\nfragment MeFragment on MeQuery {\n  id\n  username\n  clientId\n  clientName\n  sortHistories(first: 2) {\n    edges {\n      node {\n        id\n        createdAt\n        sortResult {\n          records {\n            artistId\n            memberId\n            memberKey\n            point\n            rank\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2f79387eff9ee943f8dd14af94897721";

export default node;
