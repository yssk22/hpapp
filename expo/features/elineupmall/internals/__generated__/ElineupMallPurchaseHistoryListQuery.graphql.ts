/**
 * @generated SignedSource<<109bc17dcaee050ba3beff739df91307>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ElineupMallPurchaseHistoryListQuery$variables = {
  after?: any | null | undefined;
  first?: number | null | undefined;
};
export type ElineupMallPurchaseHistoryListQuery$data = {
  readonly me: {
    readonly " $fragmentSpreads": FragmentRefs<"ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories">;
  };
};
export type ElineupMallPurchaseHistoryListQuery = {
  response: ElineupMallPurchaseHistoryListQuery$data;
  variables: ElineupMallPurchaseHistoryListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v2 = [
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
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ElineupMallPurchaseHistoryListQuery",
    "selections": [
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ElineupMallPurchaseHistoryListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MeQuery",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      }
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
            "args": (v2/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories",
            "kind": "LinkedHandle",
            "name": "elineupMallPurchaseHistories"
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c0a5840f11fa81aa49e1010311bb0006",
    "id": null,
    "metadata": {},
    "name": "ElineupMallPurchaseHistoryListQuery",
    "operationKind": "query",
    "text": "query ElineupMallPurchaseHistoryListQuery(\n  $first: Int\n  $after: Cursor\n) {\n  me {\n    ...ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories\n    id\n  }\n}\n\nfragment ElineupMallPurchaseHistoryListItemFragment on HPElineupMallItemPurchaseHistory {\n  id\n  orderID\n  orderedAt\n  name\n  price\n  num\n  permalink\n  elineupMallItem {\n    images {\n      url\n      thumbnailUrl\n    }\n    id\n  }\n}\n\nfragment ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories on MeQuery {\n  elineupMallPurchaseHistories(first: $first, after: $after) {\n    edges {\n      node {\n        id\n        ...ElineupMallPurchaseHistoryListItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "93825b4b899d0e055a383930d44ca804";

export default node;
