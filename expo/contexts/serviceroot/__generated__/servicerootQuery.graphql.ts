/**
 * @generated SignedSource<<d53ee5a5725c10e6f8c83493e8098565>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type servicerootQuery$variables = {};
export type servicerootQuery$data = {
  readonly helloproject: {
    readonly " $fragmentSpreads": FragmentRefs<"helloprojectFragment">;
  };
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"meFragment">;
  };
};
export type servicerootQuery = {
  response: servicerootQuery$data;
  variables: servicerootQuery$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "servicerootQuery",
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
            "name": "helloprojectFragment"
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
            "name": "meFragment"
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
    "name": "servicerootQuery",
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
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
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
            "args": null,
            "concreteType": "HPFollow",
            "kind": "LinkedField",
            "name": "followings",
            "plural": true,
            "selections": [
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
                  (v0/*: any*/)
                ],
                "storageKey": null
              },
              (v0/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
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
            "storageKey": "sortHistories(first:1)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d8e4c770edceb1e1e1b57a362670080b",
    "id": null,
    "metadata": {},
    "name": "servicerootQuery",
    "operationKind": "query",
    "text": "query servicerootQuery {\n  helloproject {\n    ...helloprojectFragment\n  }\n  me {\n    ...meFragment\n    id\n  }\n}\n\nfragment helloprojectFragment on HelloProjectQuery {\n  artists {\n    id\n    key\n    name\n    thumbnailURL\n    members {\n      id\n      key\n      artistKey\n      name\n      nameKana\n      thumbnailURL\n      dateOfBirth\n      bloodType\n      joinAt\n      graduateAt\n    }\n  }\n}\n\nfragment meFragment on MeQuery {\n  id\n  username\n  clientId\n  clientName\n  followings {\n    type\n    member {\n      id\n    }\n    id\n  }\n  sortHistories(first: 1) {\n    edges {\n      node {\n        id\n        createdAt\n        sortResult {\n          records {\n            artistId\n            memberId\n            memberKey\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "aca3442c85727f0744edc869c8645666";

export default node;
