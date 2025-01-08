/**
 * @generated SignedSource<<dfe78647f71f603e0132c5b38ec6d3f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ElineupMallPurchaseHistoryListQueryFragmentQuery$variables = {
  after?: any | null | undefined;
  first?: number | null | undefined;
  id: string;
};
export type ElineupMallPurchaseHistoryListQueryFragmentQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories">;
  } | null | undefined;
};
export type ElineupMallPurchaseHistoryListQueryFragmentQuery = {
  response: ElineupMallPurchaseHistoryListQueryFragmentQuery$data;
  variables: ElineupMallPurchaseHistoryListQueryFragmentQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "first"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ElineupMallPurchaseHistoryListQueryFragmentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ElineupMallPurchaseHistoryListQueryFragmentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v4/*: any*/),
                "concreteType": "HPElineupMallItemPurchaseHistoryConnection",
                "kind": "LinkedField",
                "name": "elineupMallPurchaseHistories",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "HPElineupMallItemPurchaseHistoryEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "HPElineupMallItemPurchaseHistory",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "orderID",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "orderedAt",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "price",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "num",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "permalink",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "HPElineupMallItem",
                            "kind": "LinkedField",
                            "name": "elineupMallItem",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Media",
                                "kind": "LinkedField",
                                "name": "images",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "thumbnailUrl",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "endCursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasNextPage",
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
                "args": (v4/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories",
                "kind": "LinkedHandle",
                "name": "elineupMallPurchaseHistories"
              }
            ],
            "type": "MeQuery",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f5ab35cf23d6cebd9ce2830bc9bf34e1",
    "id": null,
    "metadata": {},
    "name": "ElineupMallPurchaseHistoryListQueryFragmentQuery",
    "operationKind": "query",
    "text": "query ElineupMallPurchaseHistoryListQueryFragmentQuery(\n  $after: Cursor\n  $first: Int\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories\n    id\n  }\n}\n\nfragment ElineupMallPurchaseHistoryListItemFragment on HPElineupMallItemPurchaseHistory {\n  id\n  orderID\n  orderedAt\n  name\n  price\n  num\n  permalink\n  elineupMallItem {\n    images {\n      url\n      thumbnailUrl\n    }\n    id\n  }\n}\n\nfragment ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories on MeQuery {\n  elineupMallPurchaseHistories(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        ...ElineupMallPurchaseHistoryListItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "8651cefdb2f808f91848224151d9834c";

export default node;
